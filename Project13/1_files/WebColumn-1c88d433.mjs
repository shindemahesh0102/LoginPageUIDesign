var y=Object.defineProperty,_=Object.defineProperties;var v=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var d=(t,n,e)=>n in t?y(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,k=(t,n)=>{for(var e in n||(n={}))B.call(n,e)&&d(t,e,n[e]);if(u)for(var e of u(n))x.call(n,e)&&d(t,e,n[e]);return t},p=(t,n)=>_(t,v(n));import{u as m}from"./useWindowDimensions-da63f265.mjs";import{_ as I,B as w,r as A,o as c,c as l,b as f,F as h,z as b,n as C,A as O,a as g}from"./bootstrap-5b74a21d.mjs";const S={props:{column:{type:Object},columnIndex:{type:Number},groupBlocks:{type:Boolean,default:!1}},setup(t){w("columnIndex",t.columnIndex)},data(){return{stickyActive:!1}},computed:{headerHeight(){return m().value.headerHeight},percentOfContentArea(){return this.column.width},columnInfo(){return p(k({},this.column),{settings:this.column.settings?this.column.settings:{}})},standardBlocks(){const t=[];let n=!0;return this.columnInfo.blocks.forEach(e=>{!e.settings.keepInView&&n?t.push(e):n=!1}),JSON.parse(JSON.stringify(t))},stickyBlocks(){const t=[];let n=!1;return this.columnInfo.blocks.forEach(e=>{(e.settings.keepInView||n)&&(n=!0,t.push(e))}),JSON.parse(JSON.stringify(t))}},unmounted(){window.removeEventListener("scroll",this.handleScroll)},mounted(){window.addEventListener("scroll",this.handleScroll)},methods:{handleScroll(){this.$refs.sticky.getBoundingClientRect().top-m().value.headerHeight<=0?this.stickyActive=!0:this.stickyActive=!1}}},N={class:"standard-blocks"};function W(t,n,e,z,a,s){const i=A("LazyWebBlock");return c(),l("div",{class:O([`column-${e.columnIndex+1}`,"column","block-align-"+(s.columnInfo.settings.blockAlignment?s.columnInfo.settings.blockAlignment:"top")])},[f("div",N,[(c(!0),l(h,null,b(s.standardBlocks,(o,r)=>(c(),l("div",{key:o.id,class:"block-wrapper"},[g(i,{block:o,"block-index":r,"percent-of-content-area":s.percentOfContentArea,"group-blocks":e.groupBlocks},null,8,["block","block-index","percent-of-content-area","group-blocks"])]))),128))]),f("div",{ref:"sticky",class:"sticky-blocks",style:C({position:a.stickyActive?"sticky":"relative",top:a.stickyActive?s.headerHeight+"px":0})},[(c(!0),l(h,null,b(s.stickyBlocks,(o,r)=>(c(),l("div",{key:o.id,class:"block-wrapper"},[g(i,{block:o,"block-index":r,"percent-of-content-area":s.percentOfContentArea,"group-blocks":e.groupBlocks},null,8,["block","block-index","percent-of-content-area","group-blocks"])]))),128))],4)],2)}var J=I(S,[["render",W],["__scopeId","data-v-fbb9a108"]]);export{J as default};