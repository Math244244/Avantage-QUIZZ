function o(t){if(!t||t.length===0)return 0;const l=t.filter(c=>c.isCorrect).length,e=Math.round(l/t.length*100);return isNaN(e)||e<0||e>100?(console.error("❌ Score invalide calculé:",e),0):e}function r(t,l,e=null){return t<l?e!==null?"completed":"incomplete":t===l?"active":"locked"}export{o as calculateScore,r as getMonthlyQuizStatus};
//# sourceMappingURL=quiz-scoring-rXuWvjFg.js.map
