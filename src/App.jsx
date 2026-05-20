import React, { useState, useRef, useEffect } from "react";

let _sheetTy = 100;
const G="#8EC641",DG="#558B2F",LG="#C5E1A5",BG="#F1F8E9",CARD="#FFFFFF",T1="#1A1A1A",T2="#6B7280",SAGE="#7A9E5F";
const SKIN_COLORS={dry:"#B8D4E8",oily:"#C8E8D0",combination:"#FDE68A",sensitive:"#FECACA",all:"#C5E1A5",normal:"#D1FAE5"};
const LANGUAGES=[{code:"en",label:"English",flag:"🇺🇸"},{code:"ja",label:"日本語",flag:"🇯🇵"},{code:"zh",label:"中文",flag:"🇨🇳"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"fr",label:"Français",flag:"🇫🇷"},{code:"id",label:"Indonesia",flag:"🇮🇩"}];
const toB64=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});

// ✅ 이미지 경로 — public 폴더에 파일 이름 맞춰서 넣으세요
const MASCOT_SPLASH = "/mascot-splash.png";
const MASCOT_HOME   = "/mascot-home.png";

const UI={
  en:{tagline:"Your K-Beauty ingredient guide",takePhoto:"Take Photo",uploadPhoto:"Upload Photo",recentlySaved:"Recently Saved",result:"Scan Result",save:"Save",quickSummary:"What is this?",skinType:"Skin Type",keyIngredients:"Key Ingredients",watchOut:"Caution",howToUse:"How to Use",savedTitle:"My Products",noSaved:"No saved products yet",noSavedSub:"Scan a product and save it here!",viewDetails:"Full Details →",camPrompt:"Front or back of package",scanFrame:"Place product in frame",permDenied:"Camera denied",analyzing:"Olly is reading…",loading1:"Reading the label…",loading2:"Looking up ingredients…",loading3:"Translating for you…",products:"saved",disclaimer:"⚠️ AI-generated info — not medical advice.",privacyNote:"🔒 Photos are processed in your browser only.",settingsTitle:"Settings",language:"Language",version:"Version 1.0.0",aboutText:"Olly helps you understand Korean cosmetic labels.",dragUp:"Drag up for more"},
  ja:{tagline:"K-Beautyの成分ガイド",takePhoto:"撮影",uploadPhoto:"写真を選ぶ",recentlySaved:"最近保存",result:"スキャン結果",save:"保存",quickSummary:"これは何？",skinType:"肌タイプ",keyIngredients:"主要成分",watchOut:"注意成分",howToUse:"使い方",savedTitle:"保存した商品",noSaved:"保存した商品がありません",noSavedSub:"スキャンして保存してください",viewDetails:"詳細を見る →",camPrompt:"表面または裏面に向けて",scanFrame:"枠内に商品を入れて",permDenied:"カメラ拒否",analyzing:"オリーが読んでいます…",loading1:"読み取り中…",loading2:"成分を調べています…",loading3:"翻訳中…",products:"保存",disclaimer:"⚠️ AI情報のみ",privacyNote:"🔒 写真はデバイス内のみで処理",settingsTitle:"設定",language:"言語",version:"バージョン 1.0.0",aboutText:"OllyはK-Beautyの成分情報を提供します。",dragUp:"上にスワイプ"},
  zh:{tagline:"你的K-Beauty成分向导",takePhoto:"拍照",uploadPhoto:"上传照片",recentlySaved:"最近保存",result:"扫描结果",save:"保存",quickSummary:"这是什么？",skinType:"适合肤质",keyIngredients:"主要成分",watchOut:"注意成分",howToUse:"使用方法",savedTitle:"我的产品",noSaved:"还没有保存的产品",noSavedSub:"扫描产品并保存到这里",viewDetails:"查看详情 →",camPrompt:"对准产品正面或背面",scanFrame:"将产品放入框内",permDenied:"相机被拒绝",analyzing:"Olly正在读取…",loading1:"读取标签中…",loading2:"查找成分中…",loading3:"翻译中…",products:"已保存",disclaimer:"⚠️ AI信息仅供参考",privacyNote:"🔒 照片仅在设备上处理",settingsTitle:"设置",language:"语言",version:"版本 1.0.0",aboutText:"Olly帮助您理解韩国化妆品标签。",dragUp:"上滑查看更多"},
  es:{tagline:"Tu guía de ingredientes K-Beauty",takePhoto:"Tomar Foto",uploadPhoto:"Subir Foto",recentlySaved:"Guardado recientemente",result:"Resultado",save:"Guardar",quickSummary:"¿Qué es esto?",skinType:"Tipo de Piel",keyIngredients:"Ingredientes Clave",watchOut:"Precaución",howToUse:"Cómo Usar",savedTitle:"Mis Productos",noSaved:"Sin productos guardados",noSavedSub:"Escanea y guarda productos",viewDetails:"Ver Detalles →",camPrompt:"Frente o reverso",scanFrame:"Coloca en el marco",permDenied:"Cámara denegada",analyzing:"Olly está leyendo…",loading1:"Leyendo etiqueta…",loading2:"Buscando ingredientes…",loading3:"Traduciendo…",products:"guardados",disclaimer:"⚠️ Solo info IA",privacyNote:"🔒 Fotos solo en tu dispositivo",settingsTitle:"Ajustes",language:"Idioma",version:"Versión 1.0.0",aboutText:"Olly te ayuda a entender etiquetas K-Beauty.",dragUp:"Desliza hacia arriba"},
  fr:{tagline:"Votre guide ingrédients K-Beauty",takePhoto:"Photo",uploadPhoto:"Importer",recentlySaved:"Récemment sauvegardés",result:"Résultat",save:"Sauvegarder",quickSummary:"C'est quoi ?",skinType:"Type de Peau",keyIngredients:"Ingrédients",watchOut:"Attention",howToUse:"Comment Utiliser",savedTitle:"Mes Produits",noSaved:"Aucun produit sauvegardé",noSavedSub:"Scannez et sauvegardez",viewDetails:"Voir Détails →",camPrompt:"Recto ou verso",scanFrame:"Placez dans le cadre",permDenied:"Caméra refusée",analyzing:"Olly lit…",loading1:"Lecture…",loading2:"Recherche…",loading3:"Traduction…",products:"sauvegardés",disclaimer:"⚠️ Info IA uniquement",privacyNote:"🔒 Photos sur votre appareil seulement",settingsTitle:"Réglages",language:"Langue",version:"Version 1.0.0",aboutText:"Olly vous aide à comprendre les étiquettes K-Beauty.",dragUp:"Glissez vers le haut"},
  id:{tagline:"Panduan bahan K-Beauty Anda",takePhoto:"Ambil Foto",uploadPhoto:"Unggah Foto",recentlySaved:"Baru Disimpan",result:"Hasil Pindai",save:"Simpan",quickSummary:"Apa ini?",skinType:"Jenis Kulit",keyIngredients:"Bahan Utama",watchOut:"Perhatian",howToUse:"Cara Pakai",savedTitle:"Produk Saya",noSaved:"Belum ada produk tersimpan",noSavedSub:"Pindai produk dan simpan di sini!",viewDetails:"Detail Lengkap →",camPrompt:"Depan atau belakang kemasan",scanFrame:"Letakkan produk di bingkai",permDenied:"Kamera ditolak",analyzing:"Olly sedang membaca…",loading1:"Membaca label…",loading2:"Mencari bahan…",loading3:"Menerjemahkan…",products:"tersimpan",disclaimer:"⚠️ Info AI — bukan saran medis.",privacyNote:"🔒 Foto hanya diproses di browser Anda.",settingsTitle:"Pengaturan",language:"Bahasa",version:"Versi 1.0.0",aboutText:"Olly membantu Anda memahami label kosmetik Korea.",dragUp:"Geser ke atas untuk lebih"},
};

const FallbackMascot=({size=120,animate=false,variant="home"})=>(
  <svg viewBox="0 0 400 450" width={size} height={size*1.125} style={animate?{animation:"ollyBounce 2s ease-in-out infinite",display:"block"}:{display:"block"}}>
    {variant==="splash"&&<path d="M 28 408 A 172 172 0 0 1 372 408" fill="#F5C118"/>}
    <path d="M 134 282 C 76 252,24 295,43 356 C 78 326,112 302,134 282 Z" fill="#3C7A28" stroke="#24500E" strokeWidth="8"/>
    <path d="M 266 282 C 324 252,376 295,357 356 C 322 326,288 302,266 282 Z" fill="#3C7A28" stroke="#24500E" strokeWidth="8"/>
    <path d="M 200 54 C 280 92,340 175,326 272 C 312 362,88 362,74 272 C 60 175,120 92,200 54 Z" fill="#C4E07A" stroke="#24500E" strokeWidth="10"/>
    <ellipse cx="167" cy="170" rx="24" ry="48" fill="white" opacity="0.42" transform="rotate(-14 167 170)"/>
    <ellipse cx="154" cy="374" rx="34" ry="22" fill="#C4E07A" stroke="#24500E" strokeWidth="8"/>
    <ellipse cx="246" cy="374" rx="34" ry="22" fill="#C4E07A" stroke="#24500E" strokeWidth="8"/>
    <path d="M 158 230 Q 177 217 196 230" stroke="#2C1810" strokeWidth="7.5" fill="none" strokeLinecap="round"/>
    <circle cx="233" cy="226" r="26" fill="#2C1810"/><circle cx="223" cy="215" r="10" fill="white"/>
    <ellipse cx="150" cy="265" rx="25" ry="15" fill="#F09090" opacity="0.65"/>
    <ellipse cx="250" cy="265" rx="25" ry="15" fill="#F09090" opacity="0.65"/>
    <path d="M 183 280 Q 200 298 217 280" stroke="#2C1810" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M 200 14 L 207 36 L 230 42 L 207 48 L 200 70 L 193 48 L 170 42 L 193 36 Z" fill="#F5C118"/>
    {variant==="splash"&&<><path d="M 88 132 L 92 146 L 106 150 L 92 154 L 88 168 L 84 154 L 70 150 L 84 146 Z" fill="white"/><path d="M 310 110 L 314 122 L 326 126 L 314 130 L 310 142 L 306 130 L 294 126 L 306 122 Z" fill="white"/></>}
  </svg>
);

const OllyMascot=({size=120,animate=false,src=null,variant="home"})=>{
  const anim=animate?{animation:"ollyBounce 2s ease-in-out infinite"}:{};
  if(src){
    if(variant==="splash") return(<div style={{...anim,display:"inline-block"}}><img src={src} width={size} height={size} style={{objectFit:"cover",display:"block",borderRadius:size*0.14}} alt="Olly"/></div>);
    return <img src={src} width={size} height={size*1.1} style={{...anim,objectFit:"contain",display:"block",mixBlendMode:"multiply"}} alt="Olly"/>;
  }
  return <FallbackMascot size={size} animate={animate} variant={variant}/>;
};

export default function App(){
  const [screen,setScreen]=useState("splash");
  const [lang,setLang]=useState(LANGUAGES[0]);
  const [showLang,setShowLang]=useState(false);
  const [loading,setLoading]=useState(false);
  const [loadStep,setLoadStep]=useState(0);
  const [result,setResult]=useState(null);
  const [favs,setFavs]=useState([]);
  const [sheetOpen,setSheetOpen]=useState(false);
  const [capturedImg,setCapturedImg]=useState(null);
  const [galleryPreview,setGalleryPreview]=useState(null);
  const homeGalleryRef=useRef();
  const t=UI[lang.code]||UI.en;

  const analyzeB64=async(b64,mtype="image/jpeg")=>{
    setResult(null);setLoading(true);setSheetOpen(true);setLoadStep(0);_sheetTy=52;
    let step=0;const iv=setInterval(()=>{step=Math.min(step+1,2);setLoadStep(step);},1400);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1800,messages:[{role:"user",content:[
          {type:"image",source:{type:"base64",media_type:mtype,data:b64}},
          {type:"text",text:`You are an expert K-Beauty consultant. Analyze this Korean cosmetic product image.
Respond ONLY in ${lang.label} with valid JSON (no markdown):
{"productName":"name","brand":"brand","summary":"2-3 helpful sentences","skinType":["type1","type2"],"keyIngredients":[{"name":"ingredient","benefit":"benefit"}],"cautionIngredients":["irritants"],"howToUse":["step1","step2","step3"],"volume":"if visible or null","spf":"if applicable or null","rawKorean":"Korean name"}
If not Korean cosmetic: {"error":"Not a Korean cosmetic product"}`}
        ]}]})
      });
      clearInterval(iv);if(!res.ok)throw new Error(await res.text());
      const data=await res.json();const raw=data.content.find(b=>b.type==="text")?.text||"";
      const match=raw.match(/\{[\s\S]*\}/);if(!match)throw new Error("No JSON");
      const parsed=JSON.parse(match[0]);
      if(parsed.error){setSheetOpen(false);_sheetTy=100;alert(parsed.error);}
      else setResult({...parsed,id:Date.now()});
    }catch(e){clearInterval(iv);setSheetOpen(false);_sheetTy=100;alert("Error: "+e.message.slice(0,80));}
    finally{setLoading(false);}
  };

  const isFav=result&&favs.find(f=>f.id===result.id);
  const toggleFav=()=>isFav?setFavs(favs.filter(f=>f.id!==result.id)):setFavs([result,...favs]);
  const Tag=({children,color=LG,textColor=DG})=>(<span style={{background:color,color:textColor,borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:600,display:"inline-block"}}>{children}</span>);
  const SkinTags=({types})=>(<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{types.map((s,i)=>{const k=s.toLowerCase();const c=Object.entries(SKIN_COLORS).find(([key])=>k.includes(key))?.[1]||LG;return <Tag key={i} color={c} textColor={T1}>{s}</Tag>;})}</div>);

  const SplashScreen=()=>{
    const [phase,setPhase]=useState(0);
    const [leaving,setLeaving]=useState(false);
    useEffect(()=>{
      const t1=setTimeout(()=>setPhase(1),200);
      const t2=setTimeout(()=>setPhase(2),900);
      const t3=setTimeout(()=>setPhase(3),2000);
      const t4=setTimeout(()=>setLeaving(true),3400);
      const t5=setTimeout(()=>setScreen("home"),4100);
      return()=>{[t1,t2,t3,t4,t5].forEach(clearTimeout);};
    },[]);
    return(
      <div style={{position:"fixed",inset:0,background:"#FDF7E4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999,overflow:"hidden",opacity:leaving?0:1,transition:leaving?"opacity 0.65s ease":"none"}}>
        <div style={{position:"absolute",top:-80,left:-80,width:240,height:240,borderRadius:"50%",background:"#C8E4A0",opacity:.55}}/>
        <div style={{position:"absolute",bottom:-100,left:-80,width:280,height:280,borderRadius:"50%",background:"#C8E4A0",opacity:.45}}/>
        <div style={{transform:phase>=1?"translateY(0) scale(1)":"translateY(36px) scale(0.82)",opacity:phase>=1?1:0,transition:"transform 0.65s cubic-bezier(0.34,1.56,0.64,1),opacity 0.5s ease",marginBottom:24}}>
          <OllyMascot size={200} animate={phase>=2} variant="splash" src={MASCOT_SPLASH}/>
        </div>
        <div style={{opacity:phase>=2?1:0,transform:phase>=2?"translateY(0)":"translateY(14px)",transition:"opacity 0.5s ease 0.08s,transform 0.5s ease 0.08s",textAlign:"center"}}>
          <div style={{fontSize:54,fontWeight:900,color:"#C9D66E",letterSpacing:-2,lineHeight:1}}>Olly</div>
          <div style={{fontSize:14,color:"#7A9A2F",marginTop:10,letterSpacing:0.2}}>{t.tagline}</div>
        </div>
        <div style={{position:"absolute",bottom:42,opacity:phase>=3?1:0,transition:"opacity 0.5s ease"}}>
          <div style={{fontSize:11,color:"#C9D66E",letterSpacing:3.5,textTransform:"uppercase",fontWeight:500,opacity:.85}}>K-BEAUTY SCANNER</div>
        </div>
      </div>
    );
  };

  const SheetComp=()=>{
    const [ty,setTy]=useState(_sheetTy);const [activeDrag,setActiveDrag]=useState(false);
    const tyRef=useRef(_sheetTy);const dragging=useRef(false);const startY=useRef(0);const snapTy=useRef(0);const handleEl=useRef(null);
    const moveTy=val=>{const v=Math.max(3,Math.min(100,val));_sheetTy=v;tyRef.current=v;setTy(v);};
    useEffect(()=>{
      const el=handleEl.current;if(!el)return;
      const onS=cy=>{dragging.current=true;setActiveDrag(true);startY.current=cy;snapTy.current=tyRef.current;};
      const onM=cy=>{if(!dragging.current)return;moveTy(snapTy.current+(cy-startY.current)/(window.innerHeight||700)*100);};
      const onE=cy=>{if(!dragging.current)return;dragging.current=false;setActiveDrag(false);const d=cy-startY.current;if(d<-50)moveTy(3);else if(d>80&&snapTy.current>35)moveTy(100);else moveTy(tyRef.current<30?3:52);};
      const ts=e=>{e.preventDefault();onS(e.touches[0].clientY);};
      const tm=e=>{e.preventDefault();onM(e.touches[0].clientY);};
      const te=e=>onE(e.changedTouches[0].clientY);
      el.addEventListener("touchstart",ts,{passive:false});el.addEventListener("touchmove",tm,{passive:false});el.addEventListener("touchend",te);
      el.addEventListener("mousedown",e=>onS(e.clientY));window.addEventListener("mousemove",e=>onM(e.clientY));window.addEventListener("mouseup",e=>onE(e.clientY));
      return()=>{el.removeEventListener("touchstart",ts);el.removeEventListener("touchmove",tm);el.removeEventListener("touchend",te);};
    },[]);
    const isFull=ty<30;const loadMsgs=[t.loading1,t.loading2,t.loading3];
    return(
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%) translateY("+ty+"%)",transition:activeDrag?"none":"transform 0.35s cubic-bezier(0.32,0.72,0,1)",width:"100%",maxWidth:390,height:"92vh",background:CARD,borderRadius:"24px 24px 0 0",zIndex:200,boxShadow:"0 -8px 40px rgba(0,0,0,0.18)",display:"flex",flexDirection:"column"}}>
        <div ref={handleEl} style={{padding:"14px 0 6px",cursor:"grab",flexShrink:0,userSelect:"none",touchAction:"none"}}>
          <div style={{width:44,height:4,borderRadius:2,background:"#E5E7EB",margin:"0 auto"}}/>
          {!isFull&&!loading&&result&&<div style={{textAlign:"center",marginTop:5,fontSize:11,color:T2}}>{t.dragUp} ↑</div>}
        </div>
        <div style={{overflowY:isFull?"auto":"hidden",flex:1,WebkitOverflowScrolling:"touch"}}>
          {loading&&<div style={{padding:"20px 24px 60px",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><OllyMascot size={80} animate={true} src={MASCOT_HOME}/></div>
            <div style={{fontSize:17,fontWeight:800,color:T1,marginBottom:4}}>{t.analyzing}</div>
            <div style={{fontSize:13,color:T2}}>{loadMsgs[loadStep]}</div>
            <div style={{display:"flex",gap:7,justifyContent:"center",marginTop:14}}>{[0,1,2].map(i=>(<div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===loadStep?DG:LG,transition:"background .35s"}}/>))}</div>
          </div>}
          {!loading&&result&&<div style={{padding:"8px 20px 40px"}}>
            <div style={{background:"#FFFDE7",borderRadius:12,padding:"9px 13px",marginBottom:12,border:"1px solid #FFF176",fontSize:12,color:"#7B5800"}}>{t.disclaimer}</div>
            <div style={{background:"linear-gradient(135deg,"+BG+",#E8F5E9)",borderRadius:18,padding:16,marginBottom:12,border:"1px solid "+LG}}>
              <div style={{fontSize:10,fontWeight:800,color:G,letterSpacing:1.5,marginBottom:3,textTransform:"uppercase"}}>{result.brand}</div>
              <div style={{fontSize:19,fontWeight:800,color:T1,lineHeight:1.3}}>{result.productName}</div>
              {result.rawKorean&&<div style={{fontSize:11,color:T2,fontStyle:"italic",marginTop:3}}>{result.rawKorean}</div>}
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                {result.volume&&<Tag color="#E8F5E9" textColor={DG}>{result.volume}</Tag>}
                {result.spf&&<Tag color="#FFF9C4" textColor="#F57F17">{result.spf}</Tag>}
              </div>
            </div>
            {result.summary&&<div style={{background:CARD,borderRadius:14,padding:14,marginBottom:12,border:"1px solid "+BG}}><div style={{fontSize:10,fontWeight:700,color:DG,marginBottom:5,textTransform:"uppercase"}}>✦ {t.quickSummary}</div><div style={{fontSize:13,color:T1,lineHeight:1.75}}>{result.summary}</div></div>}
            {result.skinType?.length>0&&<div style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:600,color:T2,marginBottom:6}}>💧 {t.skinType}</div><SkinTags types={result.skinType}/></div>}
            {result.keyIngredients?.length>0&&<div style={{background:CARD,borderRadius:14,padding:14,marginBottom:12,border:"1px solid "+BG}}>
              <div style={{fontSize:10,fontWeight:700,color:T2,marginBottom:8,textTransform:"uppercase"}}>🌿 {t.keyIngredients}</div>
              {(isFull?result.keyIngredients:result.keyIngredients.slice(0,4)).map((ing,i,arr)=>(
                <div key={i} style={{display:"flex",gap:9,marginBottom:i<arr.length-1?8:0,alignItems:"flex-start"}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:G,marginTop:4,flexShrink:0}}/>
                  <div style={{fontSize:12,color:T1,lineHeight:1.55}}><span style={{fontWeight:600}}>{ing.name}</span><span style={{color:T2}}> — {ing.benefit}</span></div>
                </div>
              ))}
              {!isFull&&result.keyIngredients.length>4&&<div style={{fontSize:11,color:G,fontWeight:600,marginTop:6}}>+{result.keyIngredients.length-4} more ↑</div>}
            </div>}
            {result.cautionIngredients?.length>0&&<div style={{background:"#FFFBEB",borderRadius:14,padding:12,marginBottom:12,border:"1px solid #FDE68A"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#D97706",marginBottom:7,textTransform:"uppercase"}}>⚠️ {t.watchOut}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{result.cautionIngredients.map((c,i)=><Tag key={i} color="#FEF3C7" textColor="#92400E">{c}</Tag>)}</div>
            </div>}
            {result.howToUse?.length>0&&<div style={{background:CARD,borderRadius:14,padding:14,marginBottom:12,border:"1px solid "+BG}}>
              <div style={{fontSize:10,fontWeight:700,color:T2,marginBottom:8,textTransform:"uppercase"}}>📋 {t.howToUse}</div>
              {(isFull?result.howToUse:result.howToUse.slice(0,2)).map((step,i,arr)=>(
                <div key={i} style={{display:"flex",gap:11,marginBottom:i<arr.length-1?8:0,alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,"+G+","+DG+")",color:"white",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:12,color:T1,lineHeight:1.6,paddingTop:2}}>{step}</div>
                </div>
              ))}
              {!isFull&&result.howToUse.length>2&&<div style={{fontSize:11,color:G,fontWeight:600,marginTop:6}}>+{result.howToUse.length-2} steps ↑</div>}
            </div>}
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button onClick={toggleFav} style={{flex:1,padding:13,background:isFav?BG:CARD,border:"1.5px solid "+(isFav?G:"#E5E7EB"),borderRadius:14,cursor:"pointer",fontWeight:700,fontSize:13,color:isFav?DG:T2}}>{isFav?"❤️":"🤍"} {t.save}</button>
              {!isFull&&<button onClick={()=>moveTy(3)} style={{flex:2,padding:13,background:"linear-gradient(135deg,"+G+","+DG+")",border:"none",borderRadius:14,cursor:"pointer",fontWeight:700,fontSize:13,color:"white"}}>{t.viewDetails}</button>}
            </div>
          </div>}
        </div>
      </div>
    );
  };

  const HomeScreen=()=>(
    <div style={{background:BG,minHeight:"100vh",paddingBottom:100}} onClick={()=>showLang&&setShowLang(false)}>
      <div style={{position:"relative",height:320,overflow:"visible",borderRadius:"0 0 36px 36px",background:DG}}>
        <div style={{position:"absolute",top:-20,right:-20,width:200,height:200,borderRadius:"50%",background:G,opacity:.5}}/>
        <div style={{position:"absolute",bottom:-30,left:-30,width:160,height:160,borderRadius:"50%",background:SAGE,opacity:.4}}/>
        <div style={{position:"absolute",top:54,left:22}}>
          <div style={{fontSize:32,fontWeight:900,color:"white",letterSpacing:-1,lineHeight:1}}>Olly</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.8)",marginTop:3}}>{t.tagline}</div>
        </div>
        <div style={{position:"absolute",top:52,right:18,zIndex:30}}>
          <button onClick={e=>{e.stopPropagation();setShowLang(!showLang);}} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"8px 12px",cursor:"pointer"}}>
            <span style={{fontSize:17}}>{lang.flag}</span><span style={{fontSize:12,fontWeight:700,color:"white"}}>{lang.code.toUpperCase()}</span><span style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>▼</span>
          </button>
          {showLang&&<div style={{position:"absolute",right:0,top:46,background:CARD,borderRadius:18,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",overflow:"hidden",zIndex:200,minWidth:165}} onClick={e=>e.stopPropagation()}>
            {LANGUAGES.map(l=>(<div key={l.code} onClick={()=>{setLang(l);setShowLang(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer",background:l.code===lang.code?BG:"transparent",borderLeft:l.code===lang.code?"3px solid "+DG:"3px solid transparent"}}>
              <span style={{fontSize:19}}>{l.flag}</span><span style={{fontSize:13,fontWeight:l.code===lang.code?700:400,color:T1}}>{l.label}</span>
              {l.code===lang.code&&<span style={{marginLeft:"auto",color:G}}>✓</span>}
            </div>))}
          </div>}
        </div>
        <div style={{position:"absolute",bottom:-44,left:"50%",transform:"translateX(-50%)"}}>
          <OllyMascot size={200} animate={true} src={MASCOT_HOME}/>
        </div>
      </div>
      <div style={{padding:"64px 20px 0"}}>
        <input ref={homeGalleryRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
          const f=e.target.files[0];if(!f)return;
          setGalleryPreview(URL.createObjectURL(f));setResult(null);setSheetOpen(false);setCapturedImg(null);setScreen("gallery");
          toB64(f).then(b64=>analyzeB64(b64,f.type||"image/jpeg"));
        }}/>
        <div style={{display:"flex",gap:12,marginBottom:14}}>
          <button onClick={()=>{setResult(null);setSheetOpen(false);_sheetTy=100;setCapturedImg(null);setScreen("camera");}} style={{flex:1,padding:"18px 12px",background:"linear-gradient(135deg,"+G+","+DG+")",border:"none",borderRadius:20,cursor:"pointer",color:"white",display:"flex",flexDirection:"column",alignItems:"center",gap:7,boxShadow:"0 6px 20px "+G+"44"}}>
            <span style={{fontSize:30}}>📷</span><span style={{fontSize:14,fontWeight:800}}>{t.takePhoto}</span>
          </button>
          <button onClick={()=>homeGalleryRef.current?.click()} style={{flex:1,padding:"18px 12px",background:CARD,border:"2px solid "+G,borderRadius:20,cursor:"pointer",color:DG,display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
            <span style={{fontSize:30}}>🖼️</span><span style={{fontSize:14,fontWeight:800}}>{t.uploadPhoto}</span>
          </button>
        </div>
        <div style={{background:CARD,borderRadius:14,padding:"10px 15px",border:"1px solid "+LG,marginBottom:20}}>
          <span style={{fontSize:12,color:DG}}>{t.privacyNote}</span>
        </div>
        {favs.length>0&&<div>
          <div style={{fontSize:15,fontWeight:700,color:T1,marginBottom:12}}>{t.recentlySaved} ❤️</div>
          {favs.slice(0,3).map(f=>(<div key={f.id} onClick={()=>{setResult(f);setScreen("saved-detail");}} style={{background:CARD,borderRadius:18,padding:"14px 18px",marginBottom:10,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid "+BG}}>
            <div><div style={{fontSize:11,color:G,fontWeight:700}}>{f.brand}</div><div style={{fontSize:13,fontWeight:700,color:T1,marginTop:2}}>{f.productName}</div></div>
            <span style={{color:DG,fontSize:18}}>→</span>
          </div>))}
        </div>}
      </div>
    </div>
  );

  const CameraScreen=()=>{
    const videoRef=useRef(null),canvasRef=useRef(null);
    const [camErr,setCamErr]=useState(false);const [flash,setFlash]=useState(false);
    useEffect(()=>{
      let stream;
      (async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1920},height:{ideal:1080}}});if(videoRef.current)videoRef.current.srcObject=stream;}catch(e){setCamErr(true);}})();
      return()=>{if(stream)stream.getTracks().forEach(tr=>tr.stop());};
    },[]);
    const capture=()=>{
      const v=videoRef.current,c=canvasRef.current;if(!v||!c)return;
      c.width=v.videoWidth||1280;c.height=v.videoHeight||720;c.getContext("2d").drawImage(v,0,0);
      const url=c.toDataURL("image/jpeg",.92);setCapturedImg(url);setFlash(true);setTimeout(()=>setFlash(false),180);
      analyzeB64(url.split(",")[1],"image/jpeg");
    };
    return(
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,height:"100dvh",background:"#000",zIndex:100,overflow:"hidden"}}>
        {!capturedImg&&!camErr&&<video ref={videoRef} autoPlay playsInline muted style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
        {capturedImg&&<img src={capturedImg} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
        <canvas ref={canvasRef} style={{display:"none"}}/>
        {flash&&<div style={{position:"absolute",inset:0,background:"white",opacity:.7,zIndex:10,pointerEvents:"none"}}/>}
        {camErr&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:32,background:DG}}>
          <OllyMascot size={100} src={MASCOT_HOME}/><div style={{fontSize:15,fontWeight:700,color:"white",textAlign:"center"}}>{t.permDenied}</div>
        </div>}
        {!sheetOpen&&<div style={{position:"absolute",inset:0,zIndex:5}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"54px 20px 12px"}}>
            <button onClick={()=>{setScreen("home");setSheetOpen(false);setResult(null);_sheetTy=100;setCapturedImg(null);}} style={{background:"rgba(0,0,0,.45)",border:"none",borderRadius:20,padding:"9px 16px",color:"white",fontSize:14,fontWeight:600,cursor:"pointer"}}>✕</button>
            <div style={{fontSize:12,fontWeight:600,color:"white",background:"rgba(0,0,0,.45)",borderRadius:20,padding:"9px 16px"}}>{t.camPrompt}</div>
            <div style={{width:60}}/>
          </div>
          {!capturedImg&&<div>
            <div style={{display:"flex",justifyContent:"center",marginTop:20}}>
              <div style={{position:"relative",width:290,height:210}}>
                {[{top:0,left:0,borderTop:"3px solid "+G,borderLeft:"3px solid "+G},{top:0,right:0,borderTop:"3px solid "+G,borderRight:"3px solid "+G},{bottom:0,left:0,borderBottom:"3px solid "+G,borderLeft:"3px solid "+G},{bottom:0,right:0,borderBottom:"3px solid "+G,borderRight:"3px solid "+G}].map((s,i)=>(<div key={i} style={{position:"absolute",width:30,height:30,borderRadius:3,...s}}/>))}
                <div style={{position:"absolute",left:4,right:4,height:2,background:"linear-gradient(90deg,transparent,"+LG+",transparent)",animation:"scanLine 2.2s ease-in-out infinite"}}/>
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:14}}><span style={{fontSize:12,color:"rgba(255,255,255,.9)",background:"rgba(0,0,0,.38)",borderRadius:12,padding:"7px 16px"}}>{t.scanFrame}</span></div>
          </div>}
          {!camErr&&<div style={{position:"absolute",bottom:60,left:0,right:0,display:"flex",justifyContent:"center"}}>
            <button onClick={capture} style={{width:76,height:76,borderRadius:"50%",background:"white",border:"4px solid rgba(255,255,255,.4)",cursor:"pointer",padding:5,boxShadow:"0 0 0 6px "+G+"66"}}>
              <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"linear-gradient(135deg,"+G+","+DG+")"}}/>
            </button>
          </div>}
        </div>}
        <style>{`@keyframes scanLine{0%,100%{top:8%}50%{top:82%}}`}</style>
      </div>
    );
  };

  const GalleryScreen=()=>(
    <div style={{position:"relative",minHeight:"100vh",background:"#1a2e1a"}}>
      {galleryPreview&&<><img src={galleryPreview} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.3))"}}/></>}
      <button onClick={()=>{setScreen("home");setGalleryPreview(null);setSheetOpen(false);setResult(null);_sheetTy=100;}} style={{position:"absolute",top:52,left:18,width:42,height:42,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",color:"white",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>←</button>
    </div>
  );

  const SavedDetail=()=>{
    const r=result;if(!r)return null;
    return(
      <div style={{background:BG,minHeight:"100vh",paddingBottom:100}}>
        <div style={{padding:"52px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setScreen("saved")} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T1}}>←</button>
            <span style={{fontSize:18,fontWeight:800,color:T1}}>{t.result}</span>
          </div>
          <button onClick={toggleFav} style={{background:isFav?BG:CARD,border:"1.5px solid "+(isFav?G:"#E5E7EB"),borderRadius:20,padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <span>{isFav?"❤️":"🤍"}</span><span style={{fontSize:12,fontWeight:600,color:isFav?DG:T2}}>{t.save}</span>
          </button>
        </div>
        <div style={{padding:"0 20px"}}>
          <div style={{background:"linear-gradient(135deg,"+BG+",#E8F5E9)",borderRadius:20,padding:18,marginBottom:14,border:"1px solid "+LG}}>
            <div style={{fontSize:11,fontWeight:800,color:G,letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>{r.brand}</div>
            <div style={{fontSize:21,fontWeight:800,color:T1,lineHeight:1.3}}>{r.productName}</div>
            {r.rawKorean&&<div style={{fontSize:11,color:T2,fontStyle:"italic",marginTop:4}}>{r.rawKorean}</div>}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
              {r.volume&&<Tag color="#E8F5E9" textColor={DG}>{r.volume}</Tag>}
              {r.spf&&<Tag color="#FFF9C4" textColor="#F57F17">{r.spf}</Tag>}
            </div>
          </div>
          {r.summary&&<div style={{background:CARD,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BG}}><div style={{fontSize:11,fontWeight:700,color:DG,marginBottom:6,textTransform:"uppercase"}}>✦ {t.quickSummary}</div><div style={{fontSize:14,color:T1,lineHeight:1.78}}>{r.summary}</div></div>}
          {r.skinType?.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:600,color:T2,marginBottom:6}}>💧 {t.skinType}</div><SkinTags types={r.skinType}/></div>}
          {r.keyIngredients?.length>0&&<div style={{background:CARD,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BG}}>
            <div style={{fontSize:11,fontWeight:700,color:T2,marginBottom:10,textTransform:"uppercase"}}>🌿 {t.keyIngredients}</div>
            {r.keyIngredients.map((ing,i,arr)=>(<div key={i} style={{display:"flex",gap:10,marginBottom:i<arr.length-1?9:0,alignItems:"flex-start"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:G,marginTop:4,flexShrink:0}}/>
              <div style={{fontSize:13,color:T1,lineHeight:1.5}}><span style={{fontWeight:600}}>{ing.name}</span><span style={{color:T2}}> — {ing.benefit}</span></div>
            </div>))}
          </div>}
          {r.cautionIngredients?.length>0&&<div style={{background:"#FFFBEB",borderRadius:16,padding:14,marginBottom:14,border:"1px solid #FDE68A"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#D97706",marginBottom:8,textTransform:"uppercase"}}>⚠️ {t.watchOut}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{r.cautionIngredients.map((c,i)=><Tag key={i} color="#FEF3C7" textColor="#92400E">{c}</Tag>)}</div>
          </div>}
          {r.howToUse?.length>0&&<div style={{background:CARD,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BG}}>
            <div style={{fontSize:11,fontWeight:700,color:T2,marginBottom:10,textTransform:"uppercase"}}>📋 {t.howToUse}</div>
            {r.howToUse.map((step,i)=>(<div key={i} style={{display:"flex",gap:12,marginBottom:i<r.howToUse.length-1?10:0,alignItems:"flex-start"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,"+G+","+DG+")",color:"white",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:13,color:T1,lineHeight:1.65,paddingTop:3}}>{step}</div>
            </div>))}
          </div>}
        </div>
      </div>
    );
  };

  const SavedScreen=()=>(
    <div style={{background:BG,minHeight:"100vh",paddingBottom:100}}>
      <div style={{padding:"52px 20px 20px"}}>
        <div style={{fontSize:22,fontWeight:900,color:DG}}>❤️ {t.savedTitle}</div>
        <div style={{fontSize:13,color:T2,marginTop:2}}>{favs.length} {t.products}</div>
      </div>
      <div style={{padding:"0 20px"}}>
        {favs.length===0?(
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:.7}}><OllyMascot size={160} src={MASCOT_HOME}/></div>
            <div style={{fontSize:16,fontWeight:700,color:T1,marginBottom:6}}>{t.noSaved}</div>
            <div style={{fontSize:13,color:T2,marginBottom:20}}>{t.noSavedSub}</div>
            <button onClick={()=>setScreen("home")} style={{padding:"12px 24px",background:"linear-gradient(135deg,"+G+","+DG+")",border:"none",borderRadius:20,color:"white",fontWeight:700,fontSize:14,cursor:"pointer"}}>📷 {t.takePhoto}</button>
          </div>
        ):(favs.map(f=>(<div key={f.id} onClick={()=>{setResult(f);setScreen("saved-detail");}} style={{background:CARD,borderRadius:20,padding:18,marginBottom:12,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",border:"1px solid "+BG}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:G,fontWeight:700,marginBottom:2}}>{f.brand}</div>
            <div style={{fontSize:15,fontWeight:800,color:T1,marginBottom:6}}>{f.productName}</div>
            <div style={{fontSize:12,color:T2,lineHeight:1.5}}>{(f.summary||"").slice(0,80)}…</div>
          </div>
          <span style={{color:DG,fontSize:20,marginLeft:12}}>→</span>
        </div>)))}
      </div>
    </div>
  );

  const SettingsScreen=()=>(
    <div style={{background:BG,minHeight:"100vh",paddingBottom:100}}>
      <div style={{padding:"52px 20px 20px"}}>
        <div style={{fontSize:22,fontWeight:900,color:DG}}>⚙️ {t.settingsTitle}</div>
      </div>
      <div style={{padding:"0 20px"}}>
        <div style={{background:CARD,borderRadius:20,marginBottom:12,border:"1px solid "+BG,padding:18,boxShadow:"0 2px 8px rgba(85,139,47,0.06)"}}>
          <div style={{fontSize:12,fontWeight:700,color:T2,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>{t.language}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {LANGUAGES.map(l=>(<button key={l.code} onClick={()=>setLang(l)} style={{padding:"8px 13px",background:l.code===lang.code?"linear-gradient(135deg,"+G+","+DG+")":BG,border:"1px solid "+(l.code===lang.code?G:LG),borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:l.code===lang.code?700:400,color:l.code===lang.code?"white":T1,display:"flex",alignItems:"center",gap:5}}>
              <span>{l.flag}</span><span>{l.label}</span>
            </button>))}
          </div>
        </div>
        <div style={{background:CARD,borderRadius:20,padding:18,marginBottom:12,border:"1px solid "+BG,boxShadow:"0 2px 8px rgba(85,139,47,0.06)"}}>
          <div style={{fontSize:12,fontWeight:700,color:T2,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>⚠️ Disclaimer</div>
          <div style={{fontSize:13,color:T2,lineHeight:1.7}}>{t.disclaimer}</div>
        </div>
        <div style={{background:CARD,borderRadius:20,padding:18,marginBottom:12,border:"1px solid "+BG,boxShadow:"0 2px 8px rgba(85,139,47,0.06)"}}>
          <div style={{fontSize:12,fontWeight:700,color:T2,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>🔒 Privacy</div>
          <div style={{fontSize:13,color:T2,lineHeight:1.7}}>{t.privacyNote}</div>
        </div>
        <div style={{background:CARD,borderRadius:20,padding:18,border:"1px solid "+BG,boxShadow:"0 2px 8px rgba(85,139,47,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <OllyMascot size={44} src={MASCOT_HOME}/>
            <div><div style={{fontSize:16,fontWeight:800,color:DG}}>Olly</div><div style={{fontSize:12,color:T2}}>{t.version}</div></div>
          </div>
          <div style={{fontSize:13,color:T2,lineHeight:1.7}}>{t.aboutText}</div>
        </div>
      </div>
    </div>
  );

  const HIDE_NAV=["camera","gallery","splash"];
  const navItems=[
    {s:"home",icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>},
    {s:"saved",icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>},
    {s:"settings",icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>},
  ];

  return(
    <div style={{background:"#E0EBD8",minHeight:"100vh"}}>
      <div style={{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:BG,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative"}}>
        {screen==="splash"       && <SplashScreen/>}
        {screen==="home"         && <HomeScreen/>}
        {screen==="camera"       && <CameraScreen/>}
        {screen==="gallery"      && <GalleryScreen/>}
        {screen==="saved"        && <SavedScreen/>}
        {screen==="saved-detail" && <SavedDetail/>}
        {screen==="settings"     && <SettingsScreen/>}
        {(screen==="camera"||screen==="gallery") && <SheetComp/>}
        {!HIDE_NAV.includes(screen)&&(
          <div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",zIndex:50}}>
            <div style={{background:DG,borderRadius:50,display:"flex",alignItems:"center",padding:"6px 8px",gap:4,boxShadow:"0 6px 28px rgba(85,139,47,0.45)"}}>
              {navItems.map(({s,icon})=>(<button key={s} onClick={()=>setScreen(s)} style={{width:48,height:48,borderRadius:"50%",background:(screen===s||(s==="saved"&&screen==="saved-detail"))?G:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s",opacity:(screen===s||(s==="saved"&&screen==="saved-detail"))?1:0.65}}>{icon}</button>))}
            </div>
          </div>
        )}
        <style>{`@keyframes ollyBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      </div>
    </div>
  );
}