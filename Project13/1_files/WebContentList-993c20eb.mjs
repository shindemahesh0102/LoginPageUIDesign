import{u as c}from"./useUUID-9e573207.mjs";import{u as p}from"./useContainerPixelWidth-5aa56ad1.mjs";import{u as s}from"./useGAMNativeAd-ef537421.mjs";import{_ as f,k as o,r as g,o as l,c as m,F as y,z as C,A as r,n as d,a as v}from"./bootstrap-5b74a21d.mjs";import"./useWindowDimensions-da63f265.mjs";const S={props:{data:{type:Object,default(){return{items:[]}}},imagePosition:{type:String,default:"above"},imageShaping:{type:String,default:"crop"},numberOfColumns:{type:Number,default:1},showSummary:{type:Boolean,default:!0},showDate:{type:Boolean,default:!0},displayFullHeadlines:{type:Boolean,default:!1},breadcrumbTextTransform:{type:String},nativeAdSlotIndex:{type:[String,Number]},nativeType:{type:String,default:"list"},itemMask:{type:Boolean,default:!1},pageCompanyName:{type:String,default:""},percentOfContentArea:{type:Number}},emits:["item-click"],setup(){return{rowIndex:o("rowIndex"),columnIndex:o("columnIndex"),blockIndex:o("blockIndex")}},data(){return{id:c()}},computed:{loadFirstImageNonLazy(){return this.rowIndex<=1&&this.columnIndex===0&&this.blockIndex===0},containerPixelWidth(){return p(this.percentOfContentArea)},itemWidth(){return this.numCols>1?Math.floor(100/this.numCols)-2:100},gapWidth(){return this.numCols>1?(100-this.numCols*this.itemWidth)/this.numCols:0},imageSide(){return!(this.imagePosition==="above"||this.imagePosition==="behind"||this.imagePosition==="none")},numCols(){var i;const e=(i=this.numberOfColumns)!=null?i:1;let t=1;return e>=4&&this.containerPixelWidth>850?t=4:e>=3&&this.containerPixelWidth>(this.imageSide?750:650)?t=3:e>=2&&this.containerPixelWidth>(this.imageSide?650:550)&&(t=2),t},titleFontSize(){let e=16;const t=this.containerPixelWidth*this.itemWidth/100/this.numCols;return this.imagePosition==="above"||this.imagePosition==="behind"||this.imagePosition==="none"?t>600?e=26:t>500?e=24:t>420?e=22:e=20:t>600?e=20:t>500?e=18:t>320&&(e=16),e},itemGap(){return 16},itemsWithAd(){var t;const e=[...this.data.items];return!this.nativeAdSlotIndex||this.nativeAdSlotIndex<1||!((t=this.nativeAd)==null?void 0:t.nativeTitle)||(e[this.nativeAdSlotIndex-1]=this.nativeAd),e},nativeAd(){return this.nativeType==="list"?s().value.listItems[this.id]:s().value.body}},created(){this.nativeType==="list"&&this.nativeAdSlotIndex>0&&s.registerContentList(this.id)},methods:{checkPageCompanyName(e){var t;return((t=e.company)==null?void 0:t.name)!==this.pageCompanyName}}},x=["onClick"];function b(e,t,i,I,_,a){const u=g("LazyWebContentItem");return l(),m("div",{ref:"content_list",class:r(["items-wrapper",i.imagePosition,a.numCols>1?"grid":""]),style:d({gap:`20px ${a.gapWidth}%`})},[(l(!0),m(y,null,C(a.itemsWithAd,(n,h)=>(l(),m("div",{key:n.id,class:r(["item",e.$ss.contentStyle.itemVerticalSpacing?e.$ss.contentStyle.itemVerticalSpacing:"small"]),style:d({width:a.itemWidth+"%"}),onClick:()=>{e.$emit("item-click",n)}},[v(u,{class:"content-item","percent-of-content-area":i.percentOfContentArea*a.itemWidth/100,item:n,"title-font-size":a.titleFontSize,"show-summary":i.showSummary,"show-date":i.showDate,"display-full-headline":i.displayFullHeadlines,"image-position":i.imagePosition,"image-shaping":i.imageShaping,"page-company-name":i.pageCompanyName,"item-mask":i.itemMask,"lazy-load-image":!a.loadFirstImageNonLazy||h>0},null,8,["percent-of-content-area","item","title-font-size","show-summary","show-date","display-full-headline","image-position","image-shaping","page-company-name","item-mask","lazy-load-image"])],14,x))),128))],6)}var z=f(S,[["render",b],["__scopeId","data-v-657ba404"]]);export{z as default};
