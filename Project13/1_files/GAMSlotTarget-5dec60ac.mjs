import{_ as r,o as a,c,a as l,w as d,b as h,n as _,H as u}from"./bootstrap-5b74a21d.mjs";const m={props:{containerPixelWidth:{type:Number},targetId:{type:String,required:!0},observe:{type:Function,default:()=>{}}},emits:["visible"],computed:{width(){return typeof this.containerPixelWidth=="undefined"?"100%":this.containerPixelWidth===0?0:`${this.containerPixelWidth}px`},height(){return this.containerPixelWidth===0?"0px":"auto"}},async mounted(){this.isElementVisible(),await this.$nextTick(),this.$refs.inner&&this.observe(this.$refs.inner)},methods:{isElementVisible(){const{top:t,bottom:i}=this.$el.getBoundingClientRect(),{offsetHeight:e}=this.$el,n=window.innerHeight||document.documentElement.clientHeight;t>=-e&&i<=n+e&&this.$emit("visible")}}},p=["id"];function f(t,i,e,n,g,s){const o=u;return a(),c("div",{class:"ebm-ad-target__outer",style:_({height:s.height,width:"100%"})},[l(o,null,{default:d(()=>[h("div",{id:e.targetId,ref:"inner",class:"ebm-ad-target__inner"},null,8,p)]),_:1})],4)}var b=r(m,[["render",f]]);export{b as default};