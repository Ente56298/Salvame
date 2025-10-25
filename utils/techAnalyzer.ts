// Arquitecto: DIOS | Implementador: Jorge Hernández
// Analizador Tecnográfico para SALVAME

export interface TechProfile {
  url: string;
  timestamp: string;
  tecnologias: {
    frameworks: Record<string, any>;
    cms: Record<string, any>;
    servers: Record<string, any>;
    databases: Record<string, any>;
    analytics: Record<string, any>;
    cdn: Record<string, any>;
  };
  seguridad: {
    https: boolean;
    hsts: boolean;
    csp: boolean;
    x_frame_options: boolean;
    x_content_type_options: boolean;
    referrer_policy: boolean;
  };
  rendimiento: {
    tamano_pagina: number;
    tiempo_carga: number;
    compresion: boolean;
    cache_control: boolean;
    num_scripts: number;
    num_css: number;
    num_imagenes: number;
  };
  seo: {
    title: boolean;
    meta_description: boolean;
    h1_tags: number;
    h2_tags: number;
    alt_imagenes: number;
    total_imagenes: number;
  };
}

export class TechAnalyzer {
  static async analyzeCompetitor(url: string): Promise<TechProfile> {
    const response = await fetch(url);
    const html = await response.text();
    
    return {
      url,
      timestamp: new Date().toISOString(),
      tecnologias: this.detectTech(html),
      seguridad: this.analyzeSeguridad(response.headers),
      rendimiento: this.analyzeRendimiento(html),
      seo: this.analyzeSEO(html)
    };
  }

  private static detectTech(html: string) {
    return {
      frameworks: this.detectFrameworks(html),
      cms: this.detectCMS(html),
      servers: {},
      databases: {},
      analytics: this.detectAnalytics(html),
      cdn: {}
    };
  }

  private static detectFrameworks(html: string) {
    const frameworks: Record<string, any> = {};
    if (html.includes('react')) frameworks.react = { confianza: 60 };
    if (html.includes('vue')) frameworks.vue = { confianza: 60 };
    if (html.includes('angular')) frameworks.angular = { confianza: 60 };
    return frameworks;
  }

  private static detectCMS(html: string) {
    const cms: Record<string, any> = {};
    if (html.includes('wp-content') || html.includes('wordpress')) {
      cms.wordpress = { confianza: 80, evidencias: ['wp-content'] };
    }
    return cms;
  }

  private static detectAnalytics(html: string) {
    const analytics: Record<string, any> = {};
    if (html.includes('gtag') || html.includes('google-analytics')) {
      analytics.google_analytics = { confianza: 90 };
    }
    if (html.includes('fbq')) analytics.facebook_pixel = { confianza: 90 };
    return analytics;
  }

  private static analyzeSeguridad(headers: Headers) {
    return {
      https: true,
      hsts: headers.has('strict-transport-security'),
      csp: headers.has('content-security-policy'),
      x_frame_options: headers.has('x-frame-options'),
      x_content_type_options: headers.has('x-content-type-options'),
      referrer_policy: headers.has('referrer-policy')
    };
  }

  private static analyzeRendimiento(html: string) {
    return {
      tamano_pagina: html.length,
      tiempo_carga: 0,
      compresion: true,
      cache_control: true,
      num_scripts: (html.match(/<script/g) || []).length,
      num_css: (html.match(/<link.*stylesheet/g) || []).length,
      num_imagenes: (html.match(/<img/g) || []).length
    };
  }

  private static analyzeSEO(html: string) {
    return {
      title: /<title>/.test(html),
      meta_description: /<meta.*description/.test(html),
      h1_tags: (html.match(/<h1/g) || []).length,
      h2_tags: (html.match(/<h2/g) || []).length,
      alt_imagenes: (html.match(/alt=/g) || []).length,
      total_imagenes: (html.match(/<img/g) || []).length
    };
  }

  static compareWithSalvame(competitor: TechProfile) {
    return {
      ventajas: [
        competitor.tecnologias.analytics.google_analytics ? 
          'Salvame: Múltiples analytics integrados' : null,
        competitor.seguridad.hsts ? 
          'Salvame: Seguridad nivel empresarial' : null,
        'Salvame: 4 Agentes IA (único)',
        'Salvame: Modo offline completo'
      ].filter(Boolean),
      areas_mejora: [
        !competitor.seguridad.csp ? 'Implementar CSP' : null,
        competitor.rendimiento.num_scripts > 50 ? 'Optimizar scripts' : null
      ].filter(Boolean)
    };
  }
}
