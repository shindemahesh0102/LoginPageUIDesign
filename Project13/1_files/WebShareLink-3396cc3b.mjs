import{_ as h,o as d,c as l,h as a}from"./bootstrap-5b74a21d.mjs";const e=[];e.facebook="https://www.facebook.com/sharer/sharer.php?u={url}&title={title}&description={desc}";e.flipboard="https://share.flipboard.com/bookmarklet/popout?v=2&url={url}&title={title}";e.instapaper="http://www.instapaper.com/edit?url={url}&title={title}&description={desc}";e.linkedin="https://www.linkedin.com/sharing/share-offsite/?url={url}";e.pinterest="https://pinterest.com/pin/create/button/?url={url}&description={title}";e.pocket="https://getpocket.com/save?url={url}&title={title}";e.quora="https://www.quora.com/share?url={url}&title={title}";e.reddit="https://www.reddit.com/submit?url={url}&title={title}";e.skype="https://web.skype.com/share?url={title}%0D%0A{url}%0D%0A{desc}";e.stumbleupon="https://www.stumbleupon.com/submit?url={url}&title={title}";e.telegram="https://t.me/share/url?url={url}&text={title}%0D%0A{desc}";e.tumblr="https://www.tumblr.com/share/link?url={url}&name={title}&description={desc}";e.twitter="https://twitter.com/intent/tweet?text={title}&url={url}";e.whatsapp="https://api.whatsapp.com/send?text={title}%0D%0A{url}%0D%0A{desc}";const w=(t,i,r,s)=>{var n;return((n=e[t])!=null?n:"").replace(/\{url\}/g,encodeURIComponent(i)).replace(/\{title\}/g,encodeURIComponent(r)).replace(/\{desc\}/g,encodeURIComponent(s))},p={props:{network:{type:String,required:!0},url:{type:String,required:!0},title:{type:String,required:!0},description:{type:String,default:""},shareWindowSize:{type:Object,default:()=>({width:626,height:436})}},data(){return{shareWindowSizeTop:0,shareWindowSizeLeft:0,shareWindowSizeWindow:void 0,shareWindowSizeInterval:null}},computed:{renderedShareLink(){var t;return w((t=this.network)==null?void 0:t.toLowerCase(),this.url,this.title,this.description)}},methods:{resizeShareWindow(){const t=window.innerWidth||document.documentElement.clientWidth||window.screenX,i=window.innerHeight||document.documentElement.clientHeight||window.screenY,r=t/window.screen.availWidth;this.shareWindowSizeLeft=(t-this.shareWindowSize.width)/2/r+(window.screenLeft!==void 0?window.screenLeft:window.screenX),this.shareWindowSizeTop=(i-this.shareWindowSize.height)/2/r+(window.screenTop!==void 0?window.screenTop:window.screenY)},openShareWindow(){var t;this.resizeShareWindow(),this.shareWindow&&this.winInterval&&(clearInterval(this.winInterval),this.shareWindow.close()),this.shareWindow=window.open(this.renderedShareLink,"web-share-link-"+((t=this.network)==null?void 0:t.toLowerCase()),",height="+this.shareWindowSize.height+",width="+this.shareWindowSize.width+",left="+this.shareWindowSizeLeft+",top="+this.shareWindowSizeTop+",screenX="+this.shareWindowSizeLeft+",screenY="+this.shareWindowSizeTop),!!this.shareWindow&&(this.shareWindow.focus(),this.winInterval=setInterval(()=>{(!this.shareWindow||this.shareWindow.closed)&&(clearInterval(this.winInterval),this.shareWindow=null)},500))}}};function c(t,i,r,s,o,n){return d(),l("a",{href:"javascript:void(0)",onClick:i[0]||(i[0]=u=>n.openShareWindow())},[a(t.$slots,"default")])}var W=h(p,[["render",c]]);export{W as default};
