import{ai as r}from"./main.83b33efb.js";function o(a,n){const i=new AbortController,t=Object.assign({},n);if(t.signal)throw new Error("signal must be not set");t.signal=i.signal;const e=fetch(a,n);return e.cancel=i.abort.bind(i),e}function s(a){const i=r(`q/${a}`,{state:()=>({query:a,loading:!1,data:void 0,error:void 0,canceller:void 0}),getters:{initialized:t=>!!(t.data||t.error||t.loading),finishedAt:t=>{if(t.data)return new Date(t.data.finishedAt)},single:t=>{var e;return(e=t.data)==null?void 0:e.data[0]}},actions:{reload(){if(this.loading)return;this.loading=!0,this.error=void 0;const t=o(`https://api.ossinsight.io/q/${a}`);this.canceller=t.cancel,t.then(e=>{if(e.ok)return e.json();throw new Error(e.statusText)}).then(e=>{this.data=e}).catch(e=>{this.error=e}).finally(()=>{this.loading=!1,this.canceller=void 0})},cancel(){var t;(t=this.canceller)==null||t.call(this)}}})();return i.initialized||i.reload(),i}export{s as u};
