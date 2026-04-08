import { useState, useCallback, useMemo } from "react";

// ─── DATOS ───────────────────────────────────────────────────────────────────
const PRODUCTOS = [
  { codigo:"BLS5C",    nombre:"Bolsa Cubo 5KG",             unidad:"BLS", kilos:5,  permite_conv:true,  es_despacho:false, empaque:1  },
  { codigo:"BLS5F",    nombre:"Bolsa Frappe 5KG",           unidad:"BLS", kilos:5,  permite_conv:true,  es_despacho:false, empaque:1  },
  { codigo:"BLS5E",    nombre:"Bolsa Escama 5KG",           unidad:"BLS", kilos:5,  permite_conv:true,  es_despacho:false, empaque:1  },
  { codigo:"CUB55",    nombre:"Cubo Cristalino 5x5 (50mm)", unidad:"BLS", kilos:0,  permite_conv:false, es_despacho:false, empaque:25 },
  { codigo:"SAC25E",   nombre:"Saco Escama 25KG",           unidad:"UN",  kilos:25, permite_conv:false, es_despacho:false, empaque:1  },
  { codigo:"ESF60",    nombre:"Esfera Cristalina 6,0 cm",   unidad:"BLS", kilos:0,  permite_conv:false, es_despacho:false, empaque:20 },
  { codigo:"ESF65",    nombre:"Esfera Cristalina 6,5 cm",   unidad:"BLS", kilos:0,  permite_conv:false, es_despacho:false, empaque:20 },
  { codigo:"BAR35",    nombre:"Barra Collins 3,5x12 cm",    unidad:"BLS", kilos:0,  permite_conv:false, es_despacho:false, empaque:20 },
  { codigo:"HSECOS5",  nombre:"Box 5KG Hielo seco",         unidad:"UN",  kilos:0,  permite_conv:false, es_despacho:false, empaque:1  },
  { codigo:"HSECOS20", nombre:"Box 20KG Hielo seco",        unidad:"UN",  kilos:0,  permite_conv:false, es_despacho:false, empaque:1  },
  { codigo:"DESP",     nombre:"Despacho",                   unidad:"UN",  kilos:0,  permite_conv:false, es_despacho:true,  empaque:1  },
];

const CLIENTES_INIT = [
  { codigo:"FUKA",            nombre:"Fukasawa Restaurant",       rut:"77.454.474-7", razon:"FUKA RESTAURANT SPA",                                 direccion:"Av. Nueva Costanera 3900",     comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"mallas", activo:true },
  { codigo:"Barceloneta",     nombre:"Barceloneta",               rut:"76.710.721-8", razon:"INVERSIONES FOODCO SPA",                              direccion:"Vitacura 3391",                comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"Social1",         nombre:"Social Vitacura 1",         rut:"76.854.913-3", razon:"INVERSIONES EL PATIO SPA",                            direccion:"Av. Vitacura 3390",            comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"Social2",         nombre:"Social Vitacura 2",         rut:"76.854.913-3", razon:"INVERSIONES EL PATIO SPA",                            direccion:"Av. Vitacura 3391",            comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"TINCA",           nombre:"Social Open Kennedy",       rut:"76.854.913-3", razon:"INVERSIONES EL PATIO SPA",                            direccion:"Av. Kennedy 5601",             comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"TPE",             nombre:"T'Quila Plaza Egana",       rut:"76.308.530-9", razon:"T'QUILA SPA",                                         direccion:"Av. Larrain 5862",             comuna:"La Reina",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"TQPV",            nombre:"T'Quila Plaza Vespucio",    rut:"76.308.530-9", razon:"T'QUILA SPA",                                         direccion:"Av. Vicuna Mackenna Ote. 7110",comuna:"La Florida",  ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"tequila",         nombre:"T'Quila Huechuraba",        rut:"76.308.530-9", razon:"T'QUILA SPA",                                         direccion:"Av. Americo Vespucio 1737",    comuna:"Huechuraba",  ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"beasty",          nombre:"Beasty Butchers",           rut:"76.460.516-0", razon:"BEASTY FOODS SPA",                                    direccion:"Av. Vitacura 3456",            comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"bbgholley",       nombre:"Buena Barra Holley",        rut:"76.140.090-8", razon:"COMERCIALIZADORA VIENTO DEL CENTRO SPA",              direccion:"General Holley 2308",          comuna:"Providencia", ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"miraolashq",      nombre:"Restaurant Miraolas",       rut:"76.381.839-k", razon:"SERVICIOS GASTRONOMICOS FRANCISCA MUNIZAGA E.I.R.L.", direccion:"Los Laureles 1670",            comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"CLUBPROVI",       nombre:"Club Providencia",          rut:"70.847.200-k", razon:"CLUB PROVIDENCIA",                                    direccion:"Av. Pocuro 2878",              comuna:"Providencia", ciudad:"Santiago", cond_pago_id:8,  unidad_pref:"bolsas", activo:true },
  { codigo:"camino",          nombre:"Restaurante El Camino",     rut:"76.378.703-6", razon:"RESTAURANTES EL CAMINO SPA",                          direccion:"Padre Letelier 0203",          comuna:"Providencia", ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"cursi",           nombre:"Cursi Donuts",              rut:"77.384.347-3", razon:"WONG & FLORES SGA SPA",                               direccion:"Manuel Montt 895",             comuna:"Providencia", ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"Lapro",           nombre:"La Prohibida",              rut:"77.440.668-9", razon:"GRUPO GASTRONOMICO LA PROHIBIDA LTDA",                direccion:"Condell 893",                  comuna:"Providencia", ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"Rustik",          nombre:"Cafeteria Rustik",          rut:"78.083.966-k", razon:"GAMALEO SPA",                                         direccion:"Av. Italia 1439",              comuna:"Providencia", ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"Mazal",           nombre:"Mazal",                     rut:"77.171.188-k", razon:"SERVICIOS GASTRONOMICOS MAZAL LTDA",                  direccion:"Av. Las Condes 14141",         comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"Satira",          nombre:"Taberna Satira",            rut:"77.576.170-9", razon:"NTJ GASTRONOMIA Y EVENTOS SPA",                       direccion:"Av. Las Condes 14878",         comuna:"Lo Barnechea",ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"fluffy",          nombre:"Le Cafe de la Vie",         rut:"77.681.743-0", razon:"FLUFFY CO SPA",                                       direccion:"Padre Mariano 129",            comuna:"Providencia", ciudad:"Santiago", cond_pago_id:5,  unidad_pref:"bolsas", activo:true },
  { codigo:"MALEZA",          nombre:"Fuente Rica Rica",          rut:"77.235.758-3", razon:"BAR RESTAURANTE MALEZA LIMITADA",                     direccion:"Av. Vicuna Mackenna 135",      comuna:"Santiago",    ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"Lamesa",          nombre:"La Mesa",                   rut:"76.837.596-8", razon:"LA MESA SPA",                                         direccion:"Alonso de Cordova 2767",       comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"Hero",            nombre:"My Hero Nueva Lyon",        rut:"77.468.984-2", razon:"MY HERO SPA",                                         direccion:"Nueva de Lyon 45",             comuna:"Providencia", ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"kosh",            nombre:"Kosh",                      rut:"77.648.378-8", razon:"INVERSIONES MABUL SPA",                               direccion:"Av. Las Condes 14141",         comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"west",            nombre:"Bar West",                  rut:"77.967.382-0", razon:"LOS TRES SPA",                                        direccion:"Las Condes 14791",             comuna:"Lo Barnechea",ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"atelier",         nombre:"Espacio GA Vitacura",       rut:"78.001.344-3", razon:"ESPACIO GA SPA",                                      direccion:"Alonso de Cordova 2437",       comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"magnolia",        nombre:"Magnolia Apoquindo",        rut:"77.271.641-9", razon:"SOCIEDAD GASTRONOMICA EMME SPA",                      direccion:"Av. Apoquindo 6550",           comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"Nativo",          nombre:"Nativo La Reina",           rut:"76.644.718-k", razon:"PABLO VILLABLANCA GASTRONOMICA AUSTRAL E.I.R.L.",     direccion:"Av. Principe de Gales 9140",   comuna:"La Reina",    ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"razen",           nombre:"Razen",                     rut:"77.927.564-7", razon:"RAZEN BRAND EXPERIENCE SPA",                          direccion:"Los Trapenses 2140",           comuna:"Lo Barnechea",ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"GOZOCV",          nombre:"Gozo Vitacura",             rut:"77.708.623-5", razon:"TOMATA GALERIA CV SPA",                               direccion:"Alonso de Cordova 4355",       comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:10, unidad_pref:"bolsas", activo:true },
  { codigo:"HACIENDA",        nombre:"Hacienda Montenegro",       rut:"76.930.216-6", razon:"DISTRIBUIDORA DRINKS GROUP LTDA",                     direccion:"Av. Echenique 6315",           comuna:"La Reina",    ciudad:"Santiago", cond_pago_id:5,  unidad_pref:"bolsas", activo:true },
  { codigo:"vicentina",       nombre:"Cafe La Vicentina",         rut:"76.202.675-9", razon:"AB COFFEE & CATERING SPA",                            direccion:"Cerro El Plomo 5680 LC 203",   comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:5,  unidad_pref:"bolsas", activo:true },
  { codigo:"CPSR",            nombre:"Colegio Santa Rosa",        rut:"73.076.800-1", razon:"FUND EDUCACIONAL SANTA ROSA LO BARNECHEA",            direccion:"Av. Raul Labbe 13799",         comuna:"Lo Barnechea",ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"Udon",            nombre:"Udon La Dehesa",            rut:"76.057.232-2", razon:"UTOPIKO SPA",                                         direccion:"Av. La Dehesa 1445",           comuna:"Lo Barnechea",ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"mrwagyu",         nombre:"Mr Wagyu / Borgata",        rut:"76.530.724-4", razon:"BORGATA SPA",                                         direccion:"Av. Padre Hurtado Sur 875",    comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"Palestino",       nombre:"Estadio Palestino",         rut:"78.264.458-0", razon:"A&B SPORTS FACILITIES SPA",                           direccion:"Av. Kennedy 9351",             comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"nueva consentido",nombre:"Nueva Consentido",          rut:"77.227.749-0", razon:"NUEVA CONSENTIDO SPA",                                direccion:"Badajoz 87",                   comuna:"Las Condes",  ciudad:"Santiago", cond_pago_id:6,  unidad_pref:"bolsas", activo:true },
  { codigo:"tanta",           nombre:"Tanta La Reina",            rut:"77.528.378-5", razon:"500 SABORES SPA",                                     direccion:"Av. Larrain 5862",             comuna:"La Reina",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
  { codigo:"REDBULL",         nombre:"Red Bull",                  rut:"77.875.595-5", razon:"RED BULL CHILE SPA",                                  direccion:"Av. Vitacura 3535",            comuna:"Vitacura",    ciudad:"Santiago", cond_pago_id:7,  unidad_pref:"bolsas", activo:true },
];

const PRECIOS_INIT = {
  "FUKA":            {BLS5C:1475,BLS5F:1475,BLS5E:1475,CUB55:449,SAC25E:10000,ESF60:759,ESF65:759,BAR35:790,HSECOS5:37195,HSECOS20:96693,DESP:1},
  "Barceloneta":     {BLS5C:3000,BLS5F:3000,BLS5E:3000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:3000},
  "Social1":         {BLS5C:2000,BLS5F:2500,BLS5E:2500,CUB55:550,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Social2":         {BLS5C:2000,BLS5F:2500,BLS5E:2500,CUB55:550,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "TINCA":           {BLS5C:2000,BLS5F:2500,BLS5E:2500,CUB55:550,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "TPE":             {BLS5C:1500,BLS5F:1500,BLS5E:1500,CUB55:450,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:5000},
  "TQPV":            {BLS5C:1500,BLS5F:1500,BLS5E:1500,CUB55:450,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:5000},
  "tequila":         {BLS5C:1500,BLS5F:1500,BLS5E:1500,CUB55:450,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:5000},
  "beasty":          {BLS5C:2000,BLS5F:2000,BLS5E:2000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2000},
  "bbgholley":       {BLS5C:1500,BLS5F:1500,BLS5E:1750,CUB55:450,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "miraolashq":      {BLS5C:1600,BLS5F:1600,BLS5E:1750,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "CLUBPROVI":       {BLS5C:2100,BLS5F:2525,BLS5E:2525,CUB55:550,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:30000},
  "camino":          {BLS5C:2000,BLS5F:2000,BLS5E:2000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2000},
  "cursi":           {BLS5C:2000,BLS5F:2500,BLS5E:2500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2000},
  "Lapro":           {BLS5C:2000,BLS5F:2525,BLS5E:2525,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Rustik":          {BLS5C:3500,BLS5F:3500,BLS5E:3500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Mazal":           {BLS5C:2500,BLS5F:2500,BLS5E:2500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Satira":          {BLS5C:2500,BLS5F:2625,BLS5E:2625,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "fluffy":          {BLS5C:2500,BLS5F:3500,BLS5E:3500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "MALEZA":          {BLS5C:2250,BLS5F:2750,BLS5E:2750,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Lamesa":          {BLS5C:1890,BLS5F:1890,BLS5E:1890,CUB55:432,SAC25E:10000,ESF60:890,ESF65:990,BAR35:790,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Hero":            {BLS5C:3000,BLS5F:3000,BLS5E:3000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "kosh":            {BLS5C:3000,BLS5F:3000,BLS5E:3000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "west":            {BLS5C:2000,BLS5F:2000,BLS5E:2000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2000},
  "atelier":         {BLS5C:2150,BLS5F:2250,BLS5E:1500,CUB55:590,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2500},
  "magnolia":        {BLS5C:2500,BLS5F:2500,BLS5E:2500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2000},
  "Nativo":          {BLS5C:1790,BLS5F:1790,BLS5E:1790,CUB55:550,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "razen":           {BLS5C:3000,BLS5F:3000,BLS5E:3353,CUB55:500,SAC25E:6000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "GOZOCV":          {BLS5C:1500,BLS5F:1500,BLS5E:1500,CUB55:450,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2000},
  "HACIENDA":        {BLS5C:2000,BLS5F:2000,BLS5E:2000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2500},
  "vicentina":       {BLS5C:2500,BLS5F:2500,BLS5E:2500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "CPSR":            {BLS5C:3500,BLS5F:3500,BLS5E:3500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "Udon":            {BLS5C:2500,BLS5F:2500,BLS5E:2500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:2500},
  "mrwagyu":         {BLS5C:1500,BLS5F:1500,BLS5E:1500,CUB55:450,SAC25E:10000,ESF60:890,ESF65:990,BAR35:790,HSECOS5:37195,HSECOS20:96693,DESP:3000},
  "Palestino":       {BLS5C:1250,BLS5F:1250,BLS5E:1250,CUB55:550,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:5000},
  "nueva consentido":{BLS5C:2500,BLS5F:2750,BLS5E:2500,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "tanta":           {BLS5C:2250,BLS5F:2250,BLS5E:2250,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:1500},
  "REDBULL":         {BLS5C:3000,BLS5F:3000,BLS5E:3000,CUB55:500,SAC25E:10000,ESF60:890,ESF65:990,BAR35:890,HSECOS5:37195,HSECOS20:96693,DESP:5000},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt    = n => (n||0).toLocaleString("es-CL");
const today  = () => new Date().toLocaleDateString("es-CL");
const nowStr = () => new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});

function calcPedidoKilos(p) {
  return p.items.reduce((a,item)=>{
    const prod=PRODUCTOS.find(x=>x.codigo===item.codigo_prod);
    return a+(prod?prod.kilos*item.cantidad_bolsas:0);
  },0);
}

// Convierte cantidad en unidad preferida → bolsas
function toBoLsas(qty,unidadPref,prod) {
  if(!prod.permite_conv||unidadPref==="bolsas") return qty;
  if(unidadPref==="mallas") return qty*4;
  if(unidadPref==="kilos")  return Math.ceil(qty/prod.kilos);
  return qty;
}

// Label de unidad para mostrar al cliente
function labelUnidad(prod,unidadPref) {
  if(prod.unidad==="BLS"&&prod.empaque>1) return `bolsas (${prod.empaque} un)`;
  if(prod.permite_conv) return unidadPref;
  return prod.unidad==="BLS"?"bolsas":"unidades";
}

// ─── GENERADOR EXCEL DRIVIN — data URI (sin librería) ────────────────────────
const DRIVIN_HEADERS = [
  "Código de despacho*","Unidades_1*","Unidades_2","Unidades_3","Prioridad",
  "Código de dirección*","Nombre dirección","Nombre cliente","Tipo",
  "Dirección 1*","Referencias","Descripción","Comuna*","Provincia","Región","País*",
  "Código Postal","Latitud","Longitud","Tiempo de servicio","Inicio Ventana 1","Fin Ventana 1",
  "Características","Asignación vehículo","Telefono de Contacto","Email de Contacto",
  "Unidades del artículo","Código del artículo","Descripción del artículo",
  "Exclusividad","Posicion","Proveedor","Inicio ventana 2","Fin ventana 2",
  "Código cliente","Nombre de contacto","Código Alternativo","Mail aprobar ruta",
  "Mail iniciar ruta","Mail en camino a direccion","Mail entrega finalizada",
  "Código de ruta","Número de viaje","Tipo Unidad",
  "Texto 1","Texto 2","Texto 3","Texto 4","Texto 5","Texto 6","Texto 7","Texto 8","Texto 9","Texto 10","Texto 11",
  "Número 1","Número 2","Número 3","Número 4",
  "Correo Conductor","Costo Asignación","Ruta Maestra","Descripción despacho",
  "Codigo zona de ventas","unidades requeridas por item",
  "Telefono contacto ruta aprobada","Telefono contacto ruta iniciada",
  "Telefono contacto cerca del lugar","Telefono contacto entrega",
  "Folio","Orden de compra","Nombre 2do Contacto","Teléfono 2do Contacto","Email  2do Contacto",
  "Categoría","Url","Token","Url con token",
];

function esc(v) {
  return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function generarExcelDrivin(pedidos, corrRuta, clientes, vuelta) {
  const d = new Date();
  const fechaStr = `${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const N = DRIVIN_HEADERS.length;

  const xmlRows = [];

  // Header row
  xmlRows.push(`<Row>${DRIVIN_HEADERS.map(h=>`<Cell><Data ss:Type="String">${esc(h)}</Data></Cell>`).join("")}</Row>`);

  pedidos.forEach(p => {
    const codDespacho = `${p.id}_${corrRuta}_${fechaStr}`;
    const esManual = p.es_manual;
    const allItems = [...p.items, {codigo_prod:"DESP", cantidad_bolsas:1}];

    allItems.forEach(item => {
      const prod = PRODUCTOS.find(x=>x.codigo===item.codigo_prod);
      if(!prod) return;
      const kilos = prod.kilos * item.cantidad_bolsas;

      // 79 celdas vacías
      const cells = new Array(N).fill("");
      cells[0]  = codDespacho;           // A: Código despacho
      cells[1]  = kilos;                 // B: Kilos (número)
      cells[5]  = esManual?"":p.codigo_drivin;  // F: Código dirección
      cells[6]  = esManual?(p.nombre_manual||""):"";  // G: Nombre dirección
      cells[7]  = esManual?(p.nombre_manual||""):"";  // H: Nombre cliente
      cells[9]  = esManual?(p.direccion_manual||""):""; // J: Dirección
      cells[12] = esManual?(p.comuna_manual||""):"";    // M: Comuna
      cells[15] = esManual?"Chile":"";                  // P: País
      cells[26] = item.cantidad_bolsas;  // AA: Unidades artículo
      cells[27] = prod.unidad;           // AB: Código artículo
      cells[28] = prod.nombre;           // AC: Descripción

      const rowXml = `<Row>${cells.map((v,i)=>{
        if(i===1||i===26) return `<Cell><Data ss:Type="Number">${v||0}</Data></Cell>`;
        return `<Cell><Data ss:Type="String">${esc(v)}</Data></Cell>`;
      }).join("")}</Row>`;
      xmlRows.push(rowXml);
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Planificacion"><Table>${xmlRows.join("")}</Table></Worksheet></Workbook>`;

  // Blob download — funciona fuera del sandbox (Vercel, local)
  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `drivin_V${vuelta}_${fechaStr}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const C = {
  bg:"#0B1826",card:"#122036",input:"#0D1B2A",
  b:"#1C3A5E",bL:"#2A4F7A",
  az:"#1565C0",azCl:"#193E6E",
  vd:"#065F46",vdCl:"#064E3B",vdT:"#6EE7B7",
  am:"#92400E",amCl:"#78350F",amT:"#FCD34D",
  rj:"#991B1B",rjCl:"#7F1D1D",rjT:"#FCA5A5",
  t:"#E8EEFF",tS:"#7A9CC0",tM:"#3D6A8A",w:"#fff",
};
const btn=(bg,col,extra={})=>({padding:"8px 16px",border:"none",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit",background:bg,color:col,...extra});
const inp={width:"100%",padding:"9px 12px",background:C.input,border:`1px solid ${C.b}`,borderRadius:7,color:C.t,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"};
const th={padding:"9px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.tS,textTransform:"uppercase",letterSpacing:.8,borderBottom:`1px solid ${C.b}`,whiteSpace:"nowrap",background:C.bg};
const td={padding:"9px 12px",fontSize:13,color:C.t,borderBottom:`1px solid ${C.b}20`,verticalAlign:"top"};

function Badge({estado}) {
  const m={pendiente:{l:"Pendiente",bg:C.amCl,c:C.amT},asignado:{l:"En vuelta",bg:C.azCl,c:"#90CAF9"},despachado:{l:"Despachado ✓",bg:C.vdCl,c:C.vdT}};
  const x=m[estado]||m.pendiente;
  return <span style={{background:x.bg,color:x.c,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{x.l}</span>;
}

function Chip({children,color="#90CAF9",bg=C.azCl}) {
  return <span style={{background:bg,color,padding:"1px 7px",borderRadius:5,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;
}

// ═══════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════
function Login({onLogin}) {
  const [cod,setCod]=useState(""); const [modo,setModo]=useState("cliente"); const [err,setErr]=useState("");
  const go=()=>{
    if(modo==="admin"){if(cod==="admin"){onLogin({tipo:"admin"});return;}setErr("Clave incorrecta");return;}
    const c=CLIENTES_INIT.find(x=>x.codigo.toLowerCase()===cod.toLowerCase()&&x.activo);
    if(c){onLogin({tipo:"cliente",...c});return;}
    setErr("Código no encontrado o cliente inactivo");
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#06101E 0%,#091929 55%,#0D2A45 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:"rgba(12,24,42,0.97)",borderRadius:22,padding:"44px 38px",width:"100%",maxWidth:390,boxShadow:"0 32px 80px rgba(0,0,0,0.65)",border:`1px solid ${C.bL}`}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{fontSize:52,marginBottom:8}}>🧊</div>
          <div style={{fontSize:24,fontWeight:800,color:C.t,letterSpacing:-.5}}>Hielo Santiago</div>
          <div style={{color:C.tS,fontSize:13,marginTop:3}}>Sistema de pedidos y logística</div>
        </div>
        <div style={{display:"flex",background:"#06101E",borderRadius:9,padding:3,marginBottom:22}}>
          {[["cliente","🏪 Cliente"],["admin","⚙️ Admin"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setModo(m);setErr("");setCod("");}}
              style={{...btn(modo===m?C.az:"transparent",modo===m?C.w:C.tS),flex:1,borderRadius:7}}>
              {l}
            </button>
          ))}
        </div>
        <label style={{display:"block",fontWeight:600,color:C.t,fontSize:13,marginBottom:5}}>
          {modo==="cliente"?"Código de cliente":"Clave de administrador"}
        </label>
        <input value={cod} onChange={e=>{setCod(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}
          type={modo==="admin"?"password":"text"} placeholder={modo==="cliente"?"Ej: FUKA, camino, Lamesa...":"••••••"}
          style={{...inp,marginBottom:6,borderColor:err?C.rj:C.b}}/>
        {err&&<div style={{color:C.rjT,fontSize:12,marginBottom:8}}>{err}</div>}
        <button onClick={go} style={{...btn("linear-gradient(135deg,#1565C0,#0D47A1)",C.w),width:"100%",padding:"13px",fontSize:15,marginTop:6,boxShadow:"0 8px 24px rgba(21,101,192,0.4)"}}>
          Ingresar →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PORTAL CLIENTE (móvil)
// ═══════════════════════════════════════════════════════════════════════
function PortalCliente({usuario,pedidos,onPedido,onModificar,onLogout,precios}) {
  const [carrito,setCarrito]=useState({});
  const [nota,setNota]=useState("");
  const [paso,setPaso]=useState("cat"); // cat | confirm | done
  const [folio,setFolio]=useState("");

  const misPrecios=precios[usuario.codigo]||{};
  const unidadPref=usuario.unidad_pref||"bolsas";
  const pedidoPendiente=pedidos.find(p=>p.codigo_drivin===usuario.codigo&&p.estado==="pendiente");
  const prods=PRODUCTOS.filter(p=>!p.es_despacho&&misPrecios[p.codigo]>0);

  const cargarPedido=p=>{
    const c={};
    p.items.forEach(item=>{
      const prod=PRODUCTOS.find(x=>x.codigo===item.codigo_prod);
      if(!prod) return;
      let qty=item.cantidad_bolsas;
      if(prod.permite_conv){
        if(unidadPref==="mallas") qty=qty/4;
        else if(unidadPref==="kilos") qty=qty*prod.kilos;
      }
      c[item.codigo_prod]=qty;
    });
    setCarrito(c);setNota(p.nota||"");
  };

  const setQty=(cod,d)=>setCarrito(c=>{
    const v=Math.max(0,(c[cod]||0)+d);
    if(v===0){const{[cod]:_,...r}=c;return r;}
    return{...c,[cod]:v};
  });

  const items=useMemo(()=>prods.filter(p=>carrito[p.codigo]>0).map(p=>{
    const qty=carrito[p.codigo];
    const bolsas=toBoLsas(qty,unidadPref,p);
    return{prod:p,qty,bolsas,kilos:p.kilos*bolsas,mallas:p.permite_conv?bolsas/4:null};
  }),[carrito,unidadPref]);

  const totalKilos=items.reduce((a,x)=>a+x.kilos,0);

  const confirmar=()=>{
    const its=items.map(({prod,bolsas})=>({codigo_prod:prod.codigo,cantidad_bolsas:bolsas}));
    let id;
    if(pedidoPendiente){onModificar(pedidoPendiente.id,its,nota);id=pedidoPendiente.id;}
    else{id=onPedido({codigo_drivin:usuario.codigo,items:its,nota,es_manual:false});}
    setFolio(`P-${id}`);setPaso("done");
  };

  if(paso==="done") return (
    <div style={{minHeight:"100vh",background:"#EEF5FF",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:C.w,borderRadius:22,padding:"44px 28px",maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.1)"}}>
        <div style={{fontSize:60,marginBottom:10}}>✅</div>
        <div style={{fontSize:20,fontWeight:800,color:"#0A2540",marginBottom:6}}>{pedidoPendiente?"Pedido actualizado":"¡Pedido enviado!"}</div>
        <div style={{background:"#E8F0FE",borderRadius:9,padding:"7px 18px",display:"inline-block",marginBottom:14}}>
          <span style={{fontWeight:800,color:C.az,fontSize:17}}>{folio}</span>
        </div>
        <p style={{color:"#6B7280",marginBottom:20,fontSize:13}}>Puedes modificarlo mientras esté pendiente.</p>
        <button onClick={()=>{setCarrito({});setNota("");setPaso("cat");}} style={{...btn("#E8F0FE",C.az),padding:"11px 22px"}}>
          Volver al catálogo
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#EEF5FF",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:"#0A2540",padding:"0 16px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <span style={{fontSize:20}}>🧊</span>
            <div>
              <div style={{color:C.w,fontWeight:800,fontSize:14}}>{usuario.nombre}</div>
              <div style={{color:"#90CAF9",fontSize:10}}>{today()} · {unidadPref}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{...btn("rgba(255,255,255,0.1)",C.w),border:"1px solid rgba(255,255,255,0.2)",fontSize:12}}>Salir</button>
        </div>
      </div>

      <div style={{maxWidth:540,margin:"0 auto",padding:"14px 13px"}}>
        {/* Banner pedido pendiente */}
        {pedidoPendiente&&paso==="cat"&&(
          <div style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:11,padding:"11px 14px",marginBottom:14,display:"flex",gap:9,alignItems:"center"}}>
            <span>⚠️</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"#92400E",fontSize:13}}>Pedido pendiente — P-{pedidoPendiente.id}</div>
              <div style={{color:"#92400E",fontSize:11}}>Modifícalo antes de que sea asignado</div>
            </div>
            <button onClick={()=>cargarPedido(pedidoPendiente)} style={{...btn("#92400E","#FEF3C7"),padding:"5px 11px",fontSize:12}}>Modificar</button>
          </div>
        )}

        {paso==="cat"&&(
          <>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:17,fontWeight:800,color:"#0A2540"}}>¿Qué necesitas hoy?</div>
              <div style={{color:"#6B7280",fontSize:11,marginTop:2}}>Pedidos antes de las 12:00 → entrega hoy</div>
            </div>
            <div style={{display:"grid",gap:9}}>
              {prods.map(prod=>{
                const qty=carrito[prod.codigo]||0;
                const bolsas=toBoLsas(qty,unidadPref,prod);
                const kilos=prod.kilos*bolsas;
                const mallas=prod.permite_conv?bolsas/4:null;
                const sel=qty>0;
                const uLabel=labelUnidad(prod,unidadPref);
                return (
                  <div key={prod.codigo} style={{background:C.w,borderRadius:13,padding:"13px 14px",display:"flex",alignItems:"center",gap:11,
                    boxShadow:sel?"0 0 0 2px #1565C0,0 4px 12px rgba(21,101,192,0.12)":"0 2px 6px rgba(0,0,0,0.06)",transition:"all 0.15s"}}>
                    <span style={{fontSize:26,flexShrink:0}}>🧊</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,color:"#0A2540",fontSize:13}}>{prod.nombre}</div>
                      <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>por {uLabel}</div>
                      {sel&&(
                        <div style={{fontSize:11,color:C.az,marginTop:4,fontWeight:600}}>
                          {bolsas} bolsa{bolsas!==1?"s":""}
                          {kilos>0&&<span style={{color:"#F59E0B"}}> · {fmt(kilos)} kg</span>}
                          {mallas!=null&&mallas>0&&<span style={{color:"#10B981"}}> · {mallas%1===0?mallas:mallas.toFixed(1)} mallas</span>}
                        </div>
                      )}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                      <button onClick={()=>setQty(prod.codigo,-1)} style={{width:30,height:30,borderRadius:"50%",border:"2px solid #E5E7EB",background:"#F9FAFB",cursor:"pointer",fontSize:17,fontWeight:700,color:"#6B7280",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{width:22,textAlign:"center",fontWeight:800,fontSize:14,color:"#0A2540"}}>{qty}</span>
                      <button onClick={()=>setQty(prod.codigo,1)} style={{width:30,height:30,borderRadius:"50%",border:"none",background:C.az,cursor:"pointer",fontSize:17,fontWeight:700,color:C.w,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.keys(carrito).length>0&&(
              <>
                <div style={{marginTop:14}}>
                  <label style={{display:"block",fontWeight:600,color:"#374151",fontSize:12,marginBottom:4}}>Notas (opcional)</label>
                  <textarea value={nota} onChange={e=>setNota(e.target.value)} rows={2} placeholder="Horario, instrucciones..."
                    style={{...inp,resize:"none",background:C.w,border:"1px solid #E5E7EB",color:"#111"}}/>
                </div>
                <div style={{position:"sticky",bottom:10,marginTop:12}}>
                  <button onClick={()=>setPaso("confirm")} style={{...btn("linear-gradient(135deg,#1565C0,#0D47A1)",C.w),width:"100%",padding:"14px",fontSize:14,boxShadow:"0 8px 24px rgba(21,101,192,0.4)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span>Ver resumen del pedido</span>
                    <span>{totalKilos>0?`${fmt(totalKilos)} kg`:""} →</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {paso==="confirm"&&(
          <div>
            <button onClick={()=>setPaso("cat")} style={{...btn("none",C.az),padding:"7px 0",marginBottom:10,fontSize:13}}>← Volver a modificar</button>
            <div style={{background:C.w,borderRadius:15,padding:"18px",boxShadow:"0 4px 16px rgba(0,0,0,0.07)",marginBottom:14}}>
              <div style={{fontWeight:800,color:"#0A2540",fontSize:15,marginBottom:12,paddingBottom:9,borderBottom:"1px solid #F3F4F6"}}>📋 Resumen del pedido</div>
              {items.map(({prod,qty,bolsas,kilos,mallas},i)=>(
                <div key={prod.codigo} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:i<items.length-1?"1px solid #F3F4F6":"none"}}>
                  <div>
                    <div style={{fontWeight:700,color:"#111",fontSize:13}}>{prod.nombre}</div>
                    <div style={{fontSize:11,marginTop:2,color:"#6B7280"}}>
                      {bolsas} bolsa{bolsas!==1?"s":""}
                      {kilos>0&&<span style={{color:"#F59E0B",fontWeight:600}}> · {fmt(kilos)} kg</span>}
                      {mallas!=null&&mallas>0&&<span style={{color:"#10B981",fontWeight:600}}> · {mallas%1===0?mallas:mallas.toFixed(1)} mallas</span>}
                    </div>
                  </div>
                  <div style={{fontWeight:800,color:C.az,fontSize:13,marginLeft:10,flexShrink:0}}>{qty} {labelUnidad(prod,unidadPref)}</div>
                </div>
              ))}
              <div style={{marginTop:12,paddingTop:10,borderTop:"2px solid #E5E7EB",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontWeight:800,color:"#0A2540",fontSize:14}}>Total carga</div>
                <div style={{fontWeight:800,color:"#F59E0B",fontSize:17}}>{fmt(totalKilos)} kg</div>
              </div>
              {nota&&<div style={{marginTop:9,padding:"9px 12px",background:"#F9FAFB",borderRadius:7,fontSize:12,color:"#6B7280",fontStyle:"italic"}}>"{nota}"</div>}
            </div>
            <button onClick={confirmar} style={{...btn("linear-gradient(135deg,#065F46,#047857)",C.w),width:"100%",padding:"14px",fontSize:15,boxShadow:"0 8px 24px rgba(6,95,70,0.4)"}}>
              ✓ {pedidoPendiente?"Confirmar modificación":"Confirmar pedido"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PANEL OPERACIONES (escritorio)
// ═══════════════════════════════════════════════════════════════════════
function PanelOperaciones({pedidos,setPedidos,nextId,setNextId,corrRuta,clientes,onLogout,onIrAdmin}) {
  const [filtro,setFiltro]=useState("todos");
  const [limites,setLimites]=useState({1:1400,2:1400,3:1400});
  const [showModal,setShowModal]=useState(false);
  const [editandoId,setEditandoId]=useState(null);
  const [form,setForm]=useState({nombre:"",direccion:"",comuna:"",nota:"",items:{}});

  const hoy=pedidos.filter(p=>p.fecha===today());
  const filtrados=filtro==="todos"?hoy:filtro==="sin"?hoy.filter(p=>!p.vuelta):hoy.filter(p=>String(p.vuelta)===filtro);

  const kgVuelta=useMemo(()=>{
    const k={1:0,2:0,3:0};
    hoy.forEach(p=>{if(p.vuelta)k[p.vuelta]=(k[p.vuelta]||0)+calcPedidoKilos(p);});
    return k;
  },[hoy]);

  const asignar=(id,v)=>setPedidos(p=>p.map(x=>x.id===id?{...x,vuelta:v,estado:"asignado"}:x));
  const desasignar=(id)=>setPedidos(p=>p.map(x=>x.id===id?{...x,vuelta:null,estado:"pendiente"}:x));
  const despachar=(id)=>setPedidos(p=>p.map(x=>x.id===id?{...x,estado:"despachado"}:x));
  const eliminar=(id)=>setPedidos(p=>p.filter(x=>x.id!==id));

  const abrirEditar=p=>{
    const items={};p.items.forEach(i=>items[i.codigo_prod]=i.cantidad_bolsas);
    setForm({nombre:p.nombre_manual||"",direccion:p.direccion_manual||"",comuna:p.comuna_manual||"",nota:p.nota||"",items});
    setEditandoId(p.id);setShowModal(true);
  };

  const guardar=()=>{
    const items=Object.entries(form.items).filter(([,v])=>v>0).map(([c,q])=>({codigo_prod:c,cantidad_bolsas:q}));
    if(!form.nombre||!items.length){alert("Completa nombre y al menos un producto");return;}
    if(editandoId){
      setPedidos(p=>p.map(x=>x.id===editandoId?{...x,nombre_manual:form.nombre,direccion_manual:form.direccion,comuna_manual:form.comuna,nota:form.nota,items}:x));
      setEditandoId(null);
    } else {
      const np={id:nextId,fecha:today(),hora:nowStr(),codigo_drivin:"_manual_",nombre_manual:form.nombre,
        direccion_manual:form.direccion,comuna_manual:form.comuna,es_manual:true,items,nota:form.nota,estado:"pendiente",vuelta:null};
      setPedidos(p=>[np,...p]);setNextId(n=>n+1);
    }
    setForm({nombre:"",direccion:"",comuna:"",nota:"",items:{}});setShowModal(false);
  };

  const exportar=v=>{
    const sel=hoy.filter(p=>p.vuelta===v&&p.estado!=="despachado");
    if(!sel.length){alert(`No hay pedidos asignados a vuelta ${v}`);return;}
    generarExcelDrivin(sel,corrRuta,clientes,v);
  };

  const pend=hoy.filter(p=>p.estado==="pendiente").length;
  const asig=hoy.filter(p=>p.estado==="asignado").length;
  const desp=hoy.filter(p=>p.estado==="despachado").length;

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.t}}>
      {/* Header */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.b}`,padding:"0 28px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:22}}>🧊</span>
            <span style={{fontWeight:800,fontSize:17}}>Operaciones</span>
            <span style={{color:C.tS,fontSize:12}}>· {today()} · Ruta #{corrRuta}</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowModal(true)} style={btn(C.az,C.w)}>+ Manual</button>
            <button onClick={onIrAdmin} style={btn(C.input,C.t,{border:`1px solid ${C.b}`})}>Admin ⚙️</button>
            <button onClick={onLogout} style={btn(C.input,C.tS,{border:`1px solid ${C.b}`})}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{padding:"18px 28px"}}>
        {/* Fila superior: KPIs + Vueltas */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1.4fr 1.4fr 1.4fr",gap:12,marginBottom:18}}>
          {/* KPIs */}
          {[{l:"Pendientes",v:pend,c:C.amT,bg:C.amCl},{l:"Asignados",v:asig,c:"#90CAF9",bg:C.azCl},{l:"Despachados",v:desp,c:C.vdT,bg:C.vdCl}].map((k,i)=>(
            <div key={i} style={{background:C.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${k.c}25`}}>
              <div style={{color:k.c,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{k.l}</div>
              <div style={{color:C.w,fontSize:26,fontWeight:800}}>{k.v}</div>
            </div>
          ))}
          {/* Vueltas */}
          {[1,2,3].map(v=>{
            const kg=kgVuelta[v]||0;
            const lim=limites[v];
            const pct=Math.min(100,kg/lim*100);
            const over=kg>lim;
            return (
              <div key={v} style={{background:C.card,borderRadius:12,padding:"12px 16px",border:`1px solid ${over?"#EF444430":C.b}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{color:C.tS,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>VUELTA {v}</span>
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <input type="number" value={lim} onChange={e=>setLimites(l=>({...l,[v]:Number(e.target.value)}))}
                      style={{width:58,padding:"2px 6px",background:C.input,border:`1px solid ${C.b}`,borderRadius:5,color:C.t,fontSize:11,textAlign:"right",fontFamily:"inherit"}}/>
                    <span style={{fontSize:10,color:C.tS}}>kg</span>
                  </div>
                </div>
                <div style={{fontSize:20,fontWeight:800,color:over?"#EF4444":C.w,marginBottom:5}}>{fmt(kg)} <span style={{fontSize:12,fontWeight:400,color:C.tS}}>kg</span></div>
                <div style={{height:3,background:C.input,borderRadius:3,overflow:"hidden",marginBottom:6}}>
                  <div style={{height:"100%",width:`${pct}%`,background:over?"#EF4444":C.az,transition:"width .3s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:10,color:over?"#EF4444":C.tS}}>{over?`⚠️ +${fmt(kg-lim)} kg`:`${fmt(lim-kg)} libre`}</span>
                  <button onClick={()=>exportar(v)} style={btn(C.vdCl,C.vdT,{padding:"3px 9px",fontSize:11})}>⬇ Excel</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtros */}
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[["todos","Todos"],["sin","Sin asignar"],["1","Vuelta 1"],["2","Vuelta 2"],["3","Vuelta 3"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFiltro(v)} style={btn(filtro===v?C.az:"transparent",filtro===v?C.w:C.tS,{border:`1px solid ${filtro===v?C.az:C.b}`})}>{l}</button>
          ))}
        </div>

        {/* Tabla principal */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.b}`,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1000}}>
            <thead>
              <tr>
                {["ID","Estado","Cliente","Productos",
                  "Bolsas","Kilos","Mallas",
                  "Vuelta","Hora","Acciones"].map(h=><th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtrados.length===0&&(
                <tr><td colSpan={10} style={{...td,textAlign:"center",color:C.tM,padding:36}}>Sin pedidos</td></tr>
              )}
              {filtrados.map(p=>{
                const cl=clientes.find(c=>c.codigo===p.codigo_drivin);
                const nombre=p.es_manual?p.nombre_manual:(cl?.nombre||p.codigo_drivin);
                const dir=p.es_manual?[p.direccion_manual,p.comuna_manual].filter(Boolean).join(", "):(cl?.direccion||"");
                const totalBolsas=p.items.reduce((a,i)=>a+i.cantidad_bolsas,0);
                const totalKg=calcPedidoKilos(p);
                const totalMallas=totalBolsas/4;
                return (
                  <tr key={p.id} style={{background:p.vuelta?`${C.azCl}18`:"transparent"}}>
                    <td style={td}>
                      <div style={{fontFamily:"monospace",color:"#90CAF9",fontWeight:700,fontSize:12}}>P-{p.id}</div>
                      {p.es_manual&&<Chip bg={C.amCl} color={C.amT}>Manual</Chip>}
                    </td>
                    <td style={td}><Badge estado={p.estado}/></td>
                    <td style={td}>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{nombre}</div>
                      {dir&&<div style={{color:C.tS,fontSize:11}}>{dir}</div>}
                      {p.nota&&<div style={{color:C.tM,fontSize:11,fontStyle:"italic",marginTop:2}}>"{p.nota}"</div>}
                    </td>
                    <td style={td}>
                      {p.items.map((item,i)=>{
                        const prod=PRODUCTOS.find(x=>x.codigo===item.codigo_prod);
                        return <div key={i} style={{fontSize:12,marginBottom:1}}>{prod?.nombre||item.codigo_prod} <span style={{color:"#90CAF9"}}>×{item.cantidad_bolsas}</span></div>;
                      })}
                    </td>
                    <td style={{...td,textAlign:"center"}}><span style={{fontWeight:700,color:"#90CAF9",fontSize:14}}>{totalBolsas}</span></td>
                    <td style={{...td,textAlign:"center"}}><span style={{fontWeight:700,color:C.amT,fontSize:14}}>{fmt(totalKg)}</span></td>
                    <td style={{...td,textAlign:"center"}}><span style={{fontWeight:700,color:C.vdT,fontSize:14}}>{totalMallas%1===0?totalMallas:totalMallas.toFixed(1)}</span></td>
                    <td style={td}>
                      {p.vuelta
                        ?<Chip>V{p.vuelta}</Chip>
                        :<div style={{display:"flex",gap:3}}>{[1,2,3].map(v=>(
                          <button key={v} onClick={()=>asignar(p.id,v)} style={btn(C.azCl,"#90CAF9",{padding:"4px 9px",fontSize:12})}>V{v}</button>
                        ))}</div>
                      }
                    </td>
                    <td style={{...td,color:C.tS,fontSize:11,whiteSpace:"nowrap"}}>{p.hora}</td>
                    <td style={td}>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {p.estado==="pendiente"&&<button onClick={()=>abrirEditar(p)} style={btn(C.input,C.tS,{padding:"4px 9px",fontSize:12,border:`1px solid ${C.b}`})}>✏️</button>}
                        {p.vuelta&&p.estado!=="despachado"&&<button onClick={()=>desasignar(p.id)} style={btn(C.input,C.tS,{padding:"4px 9px",fontSize:12,border:`1px solid ${C.b}`})}>↩</button>}
                        {p.estado==="asignado"&&<button onClick={()=>despachar(p.id)} style={btn(C.vdCl,C.vdT,{padding:"4px 9px",fontSize:12})}>✓</button>}
                        {p.estado==="pendiente"&&<button onClick={()=>eliminar(p.id)} style={btn(C.rjCl,C.rjT,{padding:"4px 9px",fontSize:12})}>✕</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pedido manual / editar */}
      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
          <div style={{background:C.card,borderRadius:18,padding:"24px 22px",width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.b}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontWeight:800,fontSize:17}}>{editandoId?"✏️ Editar pedido":"+ Pedido Manual"}</div>
              <button onClick={()=>{setShowModal(false);setEditandoId(null);setForm({nombre:"",direccion:"",comuna:"",nota:"",items:{}});}} style={{background:"none",border:"none",color:C.tS,cursor:"pointer",fontSize:19}}>✕</button>
            </div>
            {[{k:"nombre",l:"Nombre cliente *",p:"Ej: Jaguares Producciones"},{k:"direccion",l:"Dirección *",p:"Calle y número"},{k:"comuna",l:"Comuna *",p:"Ej: Las Condes"},{k:"nota",l:"Nota",p:"Observaciones..."}].map(f=>(
              <div key={f.k} style={{marginBottom:10}}>
                <label style={{display:"block",fontWeight:600,fontSize:12,color:"#90CAF9",marginBottom:3}}>{f.l}</label>
                <input value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))} placeholder={f.p} style={inp}/>
              </div>
            ))}
            <div style={{fontWeight:600,fontSize:12,color:"#90CAF9",marginBottom:7,marginTop:4}}>Productos (cantidad en bolsas)</div>
            {PRODUCTOS.filter(p=>!p.es_despacho).map(prod=>(
              <div key={prod.codigo} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.b}20`}}>
                <div>
                  <div style={{fontSize:12,color:C.t}}>{prod.nombre}</div>
                  {(form.items[prod.codigo]||0)>0&&prod.kilos>0&&<div style={{fontSize:10,color:"#90CAF9"}}>{fmt((form.items[prod.codigo]||0)*prod.kilos)} kg</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <button onClick={()=>setForm(x=>({...x,items:{...x.items,[prod.codigo]:Math.max(0,(x.items[prod.codigo]||0)-1)}}))}
                    style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${C.b}`,background:C.input,color:C.t,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{width:24,textAlign:"center",fontWeight:700,color:C.t,fontSize:13}}>{form.items[prod.codigo]||0}</span>
                  <button onClick={()=>setForm(x=>({...x,items:{...x.items,[prod.codigo]:(x.items[prod.codigo]||0)+1}}))}
                    style={{width:26,height:26,borderRadius:"50%",border:"none",background:C.az,color:C.w,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>
            ))}
            <button onClick={guardar} style={{...btn(C.az,C.w),width:"100%",padding:"13px",fontSize:14,marginTop:18}}>
              {editandoId?"Guardar cambios":"Agregar a ruta"} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PANEL ADMIN (escritorio)
// ═══════════════════════════════════════════════════════════════════════
function PanelAdmin({clientes,setClientes,precios,setPrecios,onLogout,onIrOps}) {
  const [tab,setTab]=useState("clientes");
  const [bus,setBus]=useState("");
  const [editCl,setEditCl]=useState(null);
  const [editPr,setEditPr]=useState(null);
  const [prTemp,setPrTemp]=useState({});

  const fil=clientes.filter(c=>c.nombre.toLowerCase().includes(bus.toLowerCase())||c.codigo.toLowerCase().includes(bus.toLowerCase()));

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.t,display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.b}`,padding:"0 28px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:22}}>🧊</span>
            <span style={{fontWeight:800,fontSize:17}}>Administración</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onIrOps} style={btn(C.az,C.w)}>← Operaciones</button>
            <button onClick={onLogout} style={btn(C.input,C.tS,{border:`1px solid ${C.b}`})}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar tabs */}
        <div style={{width:200,background:C.card,borderRight:`1px solid ${C.b}`,padding:"16px 12px",flexShrink:0}}>
          {[["clientes","👥 Clientes"],["precios","💰 Precios"],["productos","📦 Productos"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{...btn(tab===k?C.azCl:C.card,tab===k?"#90CAF9":C.tS),width:"100%",textAlign:"left",padding:"10px 14px",marginBottom:4,display:"block",borderRadius:8,
              border:tab===k?`1px solid ${C.az}40`:"1px solid transparent"}}>
              {l}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>
          {/* CLIENTES */}
          {tab==="clientes"&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <input value={bus} onChange={e=>setBus(e.target.value)} placeholder="🔍 Buscar cliente o código..."
                  style={{...inp,maxWidth:340}}/>
                <span style={{color:C.tS,fontSize:12}}>{fil.length} cliente{fil.length!==1?"s":""}</span>
              </div>
              <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.b}`,overflow:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                  <thead>
                    <tr>
                      {["Código","Nombre sucursal","RUT","Comuna","Unidad Pref.","Estado","Acciones"].map(h=><th key={h} style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {fil.map(c=>(
                      <tr key={c.codigo} style={{opacity:c.activo?1:0.5}}>
                        <td style={td}><span style={{fontFamily:"monospace",color:"#90CAF9",fontSize:12,background:C.azCl,padding:"2px 7px",borderRadius:5}}>{c.codigo}</span></td>
                        <td style={{...td,fontWeight:700}}>{c.nombre}</td>
                        <td style={{...td,fontSize:12,color:C.tS}}>{c.rut}</td>
                        <td style={{...td,fontSize:12}}>{c.comuna}</td>
                        <td style={td}><Chip>{c.unidad_pref}</Chip></td>
                        <td style={td}><span style={{color:c.activo?C.vdT:C.rjT,fontWeight:700,fontSize:12}}>{c.activo?"● Activo":"○ Inactivo"}</span></td>
                        <td style={td}>
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={()=>setEditCl({...c})} style={btn(C.input,C.tS,{padding:"4px 10px",fontSize:12,border:`1px solid ${C.b}`})}>✏️ Editar</button>
                            <button onClick={()=>{setPrTemp({...(precios[c.codigo]||{})});setEditPr(c);}} style={btn(C.input,C.tS,{padding:"4px 10px",fontSize:12,border:`1px solid ${C.b}`})}>💰 Precios</button>
                            <button onClick={()=>setClientes(p=>p.map(x=>x.codigo===c.codigo?{...x,activo:!x.activo}:x))}
                              style={btn(c.activo?C.rjCl:C.vdCl,c.activo?C.rjT:C.vdT,{padding:"4px 10px",fontSize:12})}>
                              {c.activo?"Desactivar":"Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PRECIOS */}
          {tab==="precios"&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <input value={bus} onChange={e=>setBus(e.target.value)} placeholder="🔍 Buscar cliente..." style={{...inp,maxWidth:340}}/>
              </div>
              <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.b}`,overflow:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      <th style={{...th,minWidth:160}}>Cliente</th>
                      {PRODUCTOS.filter(p=>!p.es_despacho).map(p=>(
                        <th key={p.codigo} style={{...th,textAlign:"center",fontSize:10,minWidth:72}}>
                          {p.nombre.replace("Bolsa ","").replace(" 5KG","5").replace("Box ","").replace(" Hielo seco","HS")}
                        </th>
                      ))}
                      <th style={{...th,textAlign:"center",fontSize:10,minWidth:72}}>Despacho</th>
                      <th style={th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fil.map(c=>{
                      const p=precios[c.codigo]||{};
                      return (
                        <tr key={c.codigo}>
                          <td style={td}>
                            <div style={{fontWeight:700,fontSize:13}}>{c.nombre}</div>
                            <span style={{fontFamily:"monospace",color:"#90CAF9",fontSize:11}}>{c.codigo}</span>
                          </td>
                          {PRODUCTOS.filter(x=>!x.es_despacho).map(prod=>(
                            <td key={prod.codigo} style={{...td,textAlign:"center",fontSize:12,color:p[prod.codigo]?C.t:C.tM}}>
                              {p[prod.codigo]?`$${fmt(p[prod.codigo])}`:"—"}
                            </td>
                          ))}
                          <td style={{...td,textAlign:"center",fontSize:12,color:p.DESP?C.t:C.tM}}>{p.DESP?`$${fmt(p.DESP)}`:"—"}</td>
                          <td style={td}><button onClick={()=>{setPrTemp({...(precios[c.codigo]||{})});setEditPr(c);}} style={btn(C.azCl,"#90CAF9",{padding:"4px 9px",fontSize:12})}>✏️</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PRODUCTOS */}
          {tab==="productos"&&(
            <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.b}`,overflow:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>{["Código","Nombre","Unidad","Kg/Un","Un/Empaque","Conversión","Despacho Auto"].map(h=><th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {PRODUCTOS.map(p=>(
                    <tr key={p.codigo}>
                      <td style={td}><span style={{fontFamily:"monospace",color:"#90CAF9",background:C.azCl,padding:"2px 7px",borderRadius:5,fontSize:12}}>{p.codigo}</span></td>
                      <td style={{...td,fontWeight:700}}>{p.nombre}</td>
                      <td style={td}><Chip>{p.unidad}</Chip></td>
                      <td style={{...td,textAlign:"center"}}>{p.kilos||"—"}</td>
                      <td style={{...td,textAlign:"center"}}>{p.empaque}</td>
                      <td style={td}>{p.permite_conv?<span style={{color:C.vdT,fontWeight:700}}>✓ Sí</span>:<span style={{color:C.tM}}>No</span>}</td>
                      <td style={td}>{p.es_despacho?<span style={{color:C.amT,fontWeight:700}}>✓ Sí</span>:<span style={{color:C.tM}}>No</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal editar cliente */}
      {editCl&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
          <div style={{background:C.card,borderRadius:18,padding:"24px 22px",width:"100%",maxWidth:420,border:`1px solid ${C.b}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontWeight:800,fontSize:16}}>✏️ {editCl.nombre}</div>
              <button onClick={()=>setEditCl(null)} style={{background:"none",border:"none",color:C.tS,cursor:"pointer",fontSize:19}}>✕</button>
            </div>
            {[{k:"nombre",l:"Nombre sucursal"},{k:"direccion",l:"Dirección"},{k:"comuna",l:"Comuna"},{k:"ciudad",l:"Ciudad"}].map(f=>(
              <div key={f.k} style={{marginBottom:10}}>
                <label style={{display:"block",fontWeight:600,fontSize:12,color:"#90CAF9",marginBottom:3}}>{f.l}</label>
                <input value={editCl[f.k]||""} onChange={e=>setEditCl(x=>({...x,[f.k]:e.target.value}))} style={inp}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontWeight:600,fontSize:12,color:"#90CAF9",marginBottom:3}}>Unidad preferida</label>
              <select value={editCl.unidad_pref} onChange={e=>setEditCl(x=>({...x,unidad_pref:e.target.value}))} style={inp}>
                <option value="bolsas">bolsas</option><option value="kilos">kilos</option><option value="mallas">mallas</option>
              </select>
            </div>
            <button onClick={()=>{setClientes(p=>p.map(c=>c.codigo===editCl.codigo?{...c,...editCl}:c));setEditCl(null);}}
              style={{...btn(C.az,C.w),width:"100%",padding:"12px",fontSize:14}}>Guardar cambios</button>
          </div>
        </div>
      )}

      {/* Modal editar precios */}
      {editPr&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
          <div style={{background:C.card,borderRadius:18,padding:"24px 22px",width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.b}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{fontWeight:800,fontSize:16}}>💰 {editPr.nombre}</div>
              <button onClick={()=>setEditPr(null)} style={{background:"none",border:"none",color:C.tS,cursor:"pointer",fontSize:19}}>✕</button>
            </div>
            <div style={{color:C.tS,fontSize:12,marginBottom:14}}>Precio neto sin IVA (CLP)</div>
            {PRODUCTOS.map(prod=>(
              <div key={prod.codigo} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.b}25`}}>
                <div>
                  <div style={{fontSize:13,color:C.t}}>{prod.nombre}</div>
                  <div style={{fontSize:10,color:C.tS}}>{prod.codigo} · {prod.unidad}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{color:C.tS,fontSize:12}}>$</span>
                  <input type="number" value={prTemp[prod.codigo]||""} onChange={e=>setPrTemp(p=>({...p,[prod.codigo]:Number(e.target.value)}))}
                    style={{...inp,width:96,padding:"5px 8px",textAlign:"right"}} placeholder="0"/>
                </div>
              </div>
            ))}
            <button onClick={()=>{setPrecios(p=>({...p,[editPr.codigo]:prTemp}));setEditPr(null);}}
              style={{...btn(C.az,C.w),width:"100%",padding:"12px",fontSize:14,marginTop:14}}>Guardar precios</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [vista,setVista]=useState("login");
  const [usuario,setUsuario]=useState(null);
  const [pedidos,setPedidos]=useState([]);
  const [nextId,setNextId]=useState(2984);
  const corrRuta=2017;
  const [clientes,setClientes]=useState(CLIENTES_INIT);
  const [precios,setPrecios]=useState(PRECIOS_INIT);

  const handleLogin=u=>{setUsuario(u);setVista(u.tipo==="admin"?"operaciones":"portal");};
  const handleLogout=()=>{setUsuario(null);setVista("login");};

  const handlePedido=useCallback(({codigo_drivin,items,nota,es_manual})=>{
    const id=nextId;
    setPedidos(p=>[{id,fecha:today(),hora:nowStr(),codigo_drivin,items,nota:nota||"",es_manual,estado:"pendiente",vuelta:null},...p]);
    setNextId(n=>n+1);return id;
  },[nextId]);

  const handleModificar=useCallback((id,items,nota)=>{
    setPedidos(p=>p.map(x=>x.id===id?{...x,items,nota:nota||""}:x));
  },[]);

  if(vista==="login")       return <Login onLogin={handleLogin}/>;
  if(vista==="portal")      return <PortalCliente usuario={usuario} pedidos={pedidos} onPedido={handlePedido} onModificar={handleModificar} onLogout={handleLogout} precios={precios}/>;
  if(vista==="operaciones") return <PanelOperaciones pedidos={pedidos} setPedidos={setPedidos} nextId={nextId} setNextId={setNextId} corrRuta={corrRuta} clientes={clientes} onLogout={handleLogout} onIrAdmin={()=>setVista("admin")}/>;
  if(vista==="admin")       return <PanelAdmin clientes={clientes} setClientes={setClientes} precios={precios} setPrecios={setPrecios} onLogout={handleLogout} onIrOps={()=>setVista("operaciones")}/>;
}
