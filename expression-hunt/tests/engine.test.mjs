import test from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES, getByLevel } from '../data.js';
import { initialState, assignChallenge, usedChallengeIds, availableChallenges, currentLevel, startTimer, remainingMs, markTimedOut, grade, proceed, nextTeam, resetTeam, teamTotal, teamComplete, podium, validateState, loadState, saveState, undoLastGrade, correctJudgment } from '../engine.js';

const solve=(s,i,now)=>{const lvl=currentLevel(s.teams[i]);const ch=availableChallenges(s,lvl)[0];assignChallenge(s,lvl,ch.id);startTimer(s,now);grade(s,true,now+8500);proceed(s);};
test('question bank contains exactly six unique questions per level',()=>{
 assert.equal(CHALLENGES.length,18);assert.equal(new Set(CHALLENGES.map(c=>c.id)).size,18);
 for(let lvl=0;lvl<3;lvl++)assert.equal(getByLevel(lvl).length,6);
});
test('never repeats a challenge across teams; exactly two spare per level',()=>{
 const s=initialState();
 for(let i=0;i<4;i++){
  s.teamIndex=i;
  for(let lvl=0;lvl<3;lvl++){const available=availableChallenges(s,lvl);assert.equal(available.length,6-i);assignChallenge(s,lvl,available[0].id);startTimer(s,100000+10000*i+1000*lvl);grade(s,true,108000+10000*i+1000*lvl);if(!(i===3&&lvl===2))proceed(s);}
 }
 for(let lvl=0;lvl<3;lvl++){assert.equal(usedChallengeIds(s,lvl).size,4);assert.equal(availableChallenges(s,lvl).length,2);}assert.equal(s.teams.every(teamComplete),true);assert.equal(s.teams[0].rounds.every(r=>r.points>0),true);
});
test('30s countdown cannot be bypassed by late correct tap',()=>{
 const s=initialState();assignChallenge(s,0,'C1-01');startTimer(s,1000);assert.equal(remainingMs(s.teams[0].rounds[0],4000),27000);grade(s,true,31100);assert.equal(s.teams[0].rounds[0].status,'timeout');assert.equal(teamTotal(s.teams[0]),0);
});
test('timer expires on reload and waits for manual confirmation',()=>{
 const s=initialState();assignChallenge(s,0,'C1-01');startTimer(s,Date.now()-50000);
 const mem={v:'',getItem(){return this.v},setItem(k,v){this.v=v}};assert.equal(saveState(s,mem),true);
 const loaded=loadState(mem);assert.equal(loaded.phase,'grading');assert.equal(loaded.teams[0].rounds[0].status,'awaiting-timeout');correctJudgment(loaded,false);assert.equal(loaded.phase,'graded');assert.equal(loaded.teams[0].rounds[0].points,0);
});
test('reset a team preserves assigned cards and other teams untouched',()=>{
 const s=initialState();assignChallenge(s,0,'C1-01');startTimer(s,100);grade(s,true,1010);proceed(s);assignChallenge(s,1,'C2-01');const before=structuredClone(s.teams[1]);
 resetTeam(s);assert.equal(s.teamIndex,0);assert.equal(s.teams[0].rounds[0].challengeId,'C1-01');assert.equal(s.teams[0].rounds[1].challengeId,'C2-01');assert.equal(s.teams[0].rounds[0].points,0);assert.deepEqual(s.teams[1],before);assert.equal(validateState(s),true);
});
test('wrong judgment undo corrects result without replaying timer',()=>{
 const s=initialState();assignChallenge(s,0,'C1-01');startTimer(s,1000);grade(s,false,8000);assert.equal(s.teams[0].rounds[0].status,'wrong');assert.equal(undoLastGrade(s),true);correctJudgment(s,true);assert.equal(s.teams[0].rounds[0].status,'correct');assert.equal(teamTotal(s.teams[0]),10);
});
test('progresses team 1 to 2 after three grades and ranks by score then time',()=>{
 const s=initialState();for(let lvl=0;lvl<3;lvl++)solve(s,0,100000+40000*lvl);
 assert.equal(s.phase,'team-done');assert.equal(teamTotal(s.teams[0]),60);nextTeam(s);assert.equal(s.teamIndex,1);assert.equal(s.phase,'lobby');assert.equal(podium(s)[0].id,1);
});
test('duplicate challenge assignment is rejected, malformed sessions reset safely',()=>{
 const s=initialState();assignChallenge(s,0,'C1-01');s.teamIndex=1;assert.throws(()=>assignChallenge(s,0,'C1-01'));
 const mem={getItem:()=>'{"version":1,"teams":[]}',setItem(){}};assert.equal(loadState(mem).teams.length,4);
});
