import{_ as m,k as l,aK as u,o as r,c as h,f as p,n as o,g as c}from"./bootstrap-5b74a21d.mjs";import f from"./GAMSlotBuilder-1f9e9cae.mjs";import _ from"./GAMController-b4af3b0c.mjs";import"./useUUID-9e573207.mjs";import"./useGAMNativeAd-ef537421.mjs";import"./useContainerPixelWidth-5aa56ad1.mjs";import"./useWindowDimensions-da63f265.mjs";const g={extends:_,props:{adUnitId:{type:String,required:!0}},setup(e){return{page:l("page")}},computed:{adUnit(){return u().value.find(({id:e})=>e===this.adUnitId)},hideAd(){return this.unserved&&!this.visible},minHeight(){var i,n;const e=(n=(i=this.adUnit)==null?void 0:i.size)==null?void 0:n.reduce((a,[s,t])=>Math.min(t,a),1/0);return e&&e<1/0&&!this.hideAd?`${e}px`:0}},methods:{valid(e){return e&&this.gamBasePath&&this.gamAccountId&&((e==null?void 0:e.type)==="layout-block"||this.allowedOnPage(e))}}};function A(e,i,n,a,s,t){const d=f;return r(),h("div",{style:o({minHeight:t.minHeight,minWidth:"300px",width:"100%"})},[t.valid(t.adUnit)?(r(),p(d,{key:0,"ad-unit":t.adUnit,path:e.makePath(t.adUnit),style:o({minHeight:t.minHeight,minWidth:"300px"}),"container-pixel-width":e.containerPixelWidth,onIframeLoaded:e.onLoad,onSlotRendered:e.eventCompleted,onVisible:e.isVisible},null,8,["ad-unit","path","style","container-pixel-width","onIframeLoaded","onSlotRendered","onVisible"])):c("",!0)],4)}var B=m(g,[["render",A]]);export{B as default};