import { CHALLENGES, LEVELS, getByLevel } from './data.js';

export const STORE_KEY = 'expression-hunt-game-v1';
export const TEAM_COUNT = 4;
const VERSION = 1;

export function blankTeam(index) {
  return { id: index + 1, name: `TEAM ${String(index + 1).padStart(2, '0')}`, rounds: [null, null, null] };
}
export function initialState() {
  return { version: VERSION, teamIndex: 0, phase: 'lobby', teams: Array.from({ length: TEAM_COUNT }, (_, i) => blankTeam(i)), muted: false, lastUpdated: Date.now() };
}
export function freshRound(challengeId) {
  return { challengeId, status: 'assigned', elapsedMs: null, deadline: null, startedAt: null, awardedAt: null, points: 0 };
}
export function teamTotal(team) { return team.rounds.reduce((acc, r) => acc + (r?.points ?? 0), 0); }
export function teamTime(team) { return team.rounds.reduce((acc, r) => acc + (r?.status === 'correct' ? r.elapsedMs ?? 0 : 0), 0); }
export function teamComplete(team) { return team.rounds.every(r => ['correct','wrong','timeout'].includes(r?.status)); }
export function currentLevel(team) { const i = team.rounds.findIndex(r => !['correct','wrong','timeout'].includes(r?.status)); return i === -1 ? 3 : i; }
export function usedChallengeIds(state, level) {
  return new Set(state.teams.flatMap(team => team.rounds).filter(r => r?.challengeId && CHALLENGES.find(c => c.id === r.challengeId)?.level === level).map(r => r.challengeId));
}
export function availableChallenges(state, level) { const used = usedChallengeIds(state, level); return getByLevel(level).filter(c => !used.has(c.id)); }

/** Fisher–Yates, crypto-backed when supported; dependency-free fallback for local testing. */
export function secureRandomInt(max) {
  if (!Number.isInteger(max) || max <= 0) throw new Error('Invalid random limit');
  if (globalThis.crypto?.getRandomValues) {
    const span = 0x100000000;
    const cutoff = Math.floor(span / max) * max;
    const arr = new Uint32Array(1);
    do { globalThis.crypto.getRandomValues(arr); } while (arr[0] >= cutoff);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}
export function shuffle(input) { const result = [...input]; for (let i=result.length-1;i>0;i--) {const j=secureRandomInt(i+1);[result[i],result[j]]=[result[j],result[i]];} return result; }
export function assignChallenge(state, level, id) {
  const team = state.teams[state.teamIndex];
  if (level !== currentLevel(team)) throw new Error('Wrong level');
  if (team.rounds[level]) {
    if (team.rounds[level].challengeId !== id) throw new Error('This level already has a card');
    return team.rounds[level];
  }
  if (!availableChallenges(state,level).some(c => c.id === id)) throw new Error('Challenge was already drawn');
  team.rounds[level] = freshRound(id);
  state.phase = 'ready';
  return team.rounds[level];
}
export function startTimer(state, now = Date.now()) {
  const team = state.teams[state.teamIndex];
  const round = team.rounds[currentLevel(team)];
  if (!round || round.status !== 'assigned') throw new Error('Round not ready');
  round.startedAt = now;
  round.deadline = now + LEVELS[currentLevel(team)].duration * 1000;
  round.status = 'running';
  state.phase = 'playing';
}
export function remainingMs(round, now=Date.now()) { return Math.max(0, (round?.deadline ?? now) - now); }
export function hasExpired(round, now=Date.now()) { return !!round && round.status === 'running' && remainingMs(round, now) <= 0; }
export function markTimedOut(state, now = Date.now()) {
  const team = state.teams[state.teamIndex], round = team.rounds[currentLevel(team)];
  if (!hasExpired(round,now)) return false;
  round.status = 'awaiting-timeout'; round.elapsedMs = 30000; round.isCorrection = false;
  state.phase = 'grading'; return true;
}
export function grade(state, correct, now=Date.now()) {
  const team = state.teams[state.teamIndex], level = currentLevel(team), round = team.rounds[level];
  if (!round || !['running','awaiting-timeout'].includes(round.status)) throw new Error('Nothing to grade');
  const elapsedMs = round.status === 'awaiting-timeout' ? (round.elapsedMs ?? 30000) : Math.min(30000, Math.max(0, now - round.startedAt));
  // A zeroed timer stops counting but NEVER locks manual scoring.
  // Judges can still mark a late result correct or wrong, with elapsed time capped at 30s.
  round.status = correct ? 'correct' : 'wrong';
  round.elapsedMs = elapsedMs; round.points = correct ? LEVELS[level].point : 0; round.awardedAt = now;
  round.isCorrection = false;
  state.phase='graded';
  return round;
}
export function undoLastGrade(state) {
  if (state.phase !== 'graded') return false;
  const team = state.teams[state.teamIndex];
  const graded = [...team.rounds].reverse().find(r => ['correct','wrong','timeout'].includes(r?.status));
  if (!graded) return false;
  // Keep the time used; allow the judge to correct a mistaken tap without replaying the timer.
  graded.status='awaiting-timeout'; graded.points=0; graded.awardedAt=null; graded.isCorrection=true;
  state.phase='grading';
  return true;
}
export function correctJudgment(state, correct) {
  if(state.phase!=='grading') throw new Error('Not in grading screen');
  const team=state.teams[state.teamIndex],r=[...team.rounds].reverse().find(x=>x?.status==='awaiting-timeout');
  if(!r)throw new Error('No judgment pending');
  const level=team.rounds.indexOf(r);
  r.status=correct?'correct':'wrong';
  r.points=r.status==='correct'?LEVELS[level].point:0;
  r.awardedAt=Date.now();r.isCorrection=false;state.phase='graded';
}
export function proceed(state) {
  if(state.phase!=='graded') throw new Error('Must grade first');
  const team=state.teams[state.teamIndex];
  if(teamComplete(team)) {
    const next=state.teams.findIndex((t,i)=>i>state.teamIndex&&!teamComplete(t));
    state.phase=next===-1?'results':'team-done';
  } else state.phase=team.rounds[currentLevel(team)]?'ready':'deck';
}
export function nextTeam(state) {
  if(state.phase!=='team-done')throw new Error('Team is not done');
  const next=state.teams.findIndex((t,i)=>i>state.teamIndex&&!teamComplete(t));
  if(next===-1){state.phase='results';return;}
  state.teamIndex=next;state.phase='lobby';
}
export function resetTeam(state) {
  const team=state.teams[state.teamIndex];
  team.rounds=team.rounds.map(r=>r?freshRound(r.challengeId):null);
  state.phase='lobby';
}
export function podium(state) { return [...state.teams].map(t=>({ ...t, score:teamTotal(t), time:teamTime(t) })).sort((a,b)=>b.score-a.score || a.time-b.time || a.id-b.id); }

const STATES = new Set(['lobby','deck','ready','playing','grading','graded','team-done','results']);
export function validateState(state) {
  if (!state || state.version!==VERSION || !Array.isArray(state.teams) || state.teams.length!==TEAM_COUNT || !STATES.has(state.phase) || !Number.isInteger(state.teamIndex) || state.teamIndex<0 || state.teamIndex>=TEAM_COUNT)return false;
  const seen=new Set();
  for(const team of state.teams){if(!Array.isArray(team.rounds)||team.rounds.length!==3)return false;for(let i=0;i<3;i++){const r=team.rounds[i];if(!r)continue;const ch=CHALLENGES.find(c=>c.id===r.challengeId&&c.level===i);if(!ch||seen.has(ch.id))return false;seen.add(ch.id);}}
  return true;
}
export function loadState(storage = null) {
  try { const backend = storage ?? globalThis.localStorage; const json=backend.getItem(STORE_KEY);if(!json)return initialState();const state=JSON.parse(json);if(!validateState(state))return initialState();if(state.phase==='playing'){const team=state.teams[state.teamIndex];const active=team.rounds.find(r=>r?.status==='running');if(hasExpired(active)){active.status='awaiting-timeout';active.elapsedMs=30000;state.phase='grading';}}
    return state;
  } catch { return initialState(); }
}
export function saveState(state,storage=null){state.lastUpdated=Date.now();try{const backend=storage ?? globalThis.localStorage;backend.setItem(STORE_KEY,JSON.stringify(state));return true;}catch{return false;}}
