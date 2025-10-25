#!/usr/bin/env python3
"""
🤖 RASTREADOR AUTOMÁTICO DE TENDENCIAS
Sistema inteligente para ampliar biblioteca de conocimiento
"""

import requests
import feedparser
import json
import sqlite3
from datetime import datetime, timedelta
import schedule
import time
import openai
from bs4 import BeautifulSoup
import hashlib
import logging

class TrendTracker:
    def __init__(self):
        self.db_path = "knowledge_base.db"
        self.setup_database()
        self.setup_logging()
        
        # Fuentes RSS configuradas
        self.rss_sources = {
            'awwwards': 'https://www.awwwards.com/rss-feeds/',
            'dribbble': 'https://dribbble.com/shots/popular.rss',
            'github': 'https://github.com/trending.atom',
            'mit_tech': 'https://www.technologyreview.com/feed/',
            'nature': 'https://www.nature.com/nature.rss',
            'hbr': 'https://hbr.org/feed',
            'product_hunt': 'https://www.producthunt.com/feed',
            'css_tricks': 'https://css-tricks.com/feed/',
            'smashing': 'https://www.smashingmagazine.com/feed/',
            'dev_to': 'https://dev.to/feed'
        }
        
        # APIs para tendencias
        self.api_sources = {
            'reddit_programming': 'https://www.reddit.com/r/programming/hot.json',
            'reddit_webdev': 'https://www.reddit.com/r/webdev/hot.json',
            'reddit_design': 'https://www.reddit.com/r/design/hot.json',
            'hackernews': 'https://hacker-news.firebaseio.com/v0/topstories.json'
        }

    def setup_database(self):
        """Configurar base de datos SQLite"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS discoveries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                url TEXT UNIQUE NOT NULL,
                description TEXT,
                source TEXT NOT NULL,
                category TEXT,
                tags TEXT,
                relevance_score REAL DEFAULT 0.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                hash TEXT UNIQUE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trends (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                keyword TEXT NOT NULL,
                frequency INTEGER DEFAULT 1,
                category TEXT,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                trend_score REAL DEFAULT 0.0
            )
        ''')
        
        conn.commit()
        conn.close()

    def setup_logging(self):
        """Configurar logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('trend_tracker.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def scan_rss_feeds(self):
        """Escanear todas las fuentes RSS"""
        discoveries = []
        
        for source, url in self.rss_sources.items():
            try:
                self.logger.info(f"Escaneando {source}...")
                feed = feedparser.parse(url)
                
                for entry in feed.entries[:10]:  # Top 10 por fuente
                    discovery = {
                        'title': entry.get('title', ''),
                        'url': entry.get('link', ''),
                        'description': entry.get('summary', ''),
                        'source': source,
                        'published': entry.get('published_parsed', None)
                    }
                    
                    if self.is_relevant(discovery):
                        discoveries.append(discovery)
                        
            except Exception as e:
                self.logger.error(f"Error escaneando {source}: {e}")
        
        return discoveries

    def scan_api_sources(self):
        """Escanear APIs de tendencias"""
        discoveries = []
        
        # Reddit APIs
        for source, url in self.api_sources.items():
            try:
                if 'reddit' in source:
                    discoveries.extend(self.scan_reddit(source, url))
                elif 'hackernews' in source:
                    discoveries.extend(self.scan_hackernews(url))
                    
            except Exception as e:
                self.logger.error(f"Error escaneando {source}: {e}")
        
        return discoveries

    def scan_reddit(self, source, url):
        """Escanear subreddits específicos"""
        headers = {'User-Agent': 'TrendTracker/1.0'}
        response = requests.get(url, headers=headers)
        data = response.json()
        
        discoveries = []
        for post in data['data']['children'][:5]:  # Top 5
            post_data = post['data']
            
            discovery = {
                'title': post_data.get('title', ''),
                'url': post_data.get('url', ''),
                'description': post_data.get('selftext', '')[:500],
                'source': source,
                'score': post_data.get('score', 0)
            }
            
            if self.is_relevant(discovery):
                discoveries.append(discovery)
        
        return discoveries

    def scan_hackernews(self, url):
        """Escanear Hacker News"""
        response = requests.get(url)
        story_ids = response.json()[:10]  # Top 10
        
        discoveries = []
        for story_id in story_ids:
            story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
            story_response = requests.get(story_url)
            story_data = story_response.json()
            
            if story_data and story_data.get('url'):
                discovery = {
                    'title': story_data.get('title', ''),
                    'url': story_data.get('url', ''),
                    'description': '',
                    'source': 'hackernews',
                    'score': story_data.get('score', 0)
                }
                
                if self.is_relevant(discovery):
                    discoveries.append(discovery)
        
        return discoveries

    def is_relevant(self, discovery):
        """Filtrar contenido relevante usando keywords"""
        relevant_keywords = [
            # Diseño y UX
            'design', 'ux', 'ui', 'interface', 'user experience',
            'figma', 'sketch', 'adobe', 'prototype', 'wireframe',
            
            # Desarrollo
            'javascript', 'react', 'vue', 'angular', 'node',
            'python', 'api', 'database', 'framework', 'library',
            
            # Tecnología emergente
            'ai', 'machine learning', 'blockchain', 'iot',
            'quantum', 'vr', 'ar', 'metaverse', 'web3',
            
            # Negocios y startups
            'startup', 'funding', 'venture', 'saas', 'business model',
            'growth', 'marketing', 'strategy', 'innovation'
        ]
        
        text = f"{discovery['title']} {discovery['description']}".lower()
        return any(keyword in text for keyword in relevant_keywords)

    def classify_with_ai(self, discovery):
        """Clasificar descubrimiento usando IA"""
        try:
            prompt = f"""
            Clasifica este contenido:
            Título: {discovery['title']}
            Descripción: {discovery['description'][:300]}
            
            Responde en JSON:
            {{
                "category": "diseño|desarrollo|ciencia|negocio|arte|educación",
                "tags": ["tag1", "tag2", "tag3"],
                "relevance_score": 0.0-1.0,
                "summary": "resumen en 50 palabras"
            }}
            """
            
            # Aquí integrarías con OpenAI o Gemini
            # Por ahora, clasificación básica
            return self.basic_classification(discovery)
            
        except Exception as e:
            self.logger.error(f"Error en clasificación IA: {e}")
            return self.basic_classification(discovery)

    def basic_classification(self, discovery):
        """Clasificación básica por keywords"""
        text = f"{discovery['title']} {discovery['description']}".lower()
        
        categories = {
            'diseño': ['design', 'ui', 'ux', 'figma', 'sketch', 'prototype'],
            'desarrollo': ['javascript', 'react', 'vue', 'python', 'api', 'code'],
            'ciencia': ['research', 'study', 'science', 'ai', 'machine learning'],
            'negocio': ['startup', 'business', 'funding', 'growth', 'strategy'],
            'arte': ['art', 'creative', 'visual', 'graphic', 'illustration'],
            'educación': ['tutorial', 'learn', 'course', 'education', 'guide']
        }
        
        for category, keywords in categories.items():
            if any(keyword in text for keyword in keywords):
                return {
                    'category': category,
                    'tags': [kw for kw in keywords if kw in text][:3],
                    'relevance_score': 0.7,
                    'summary': discovery['description'][:100]
                }
        
        return {
            'category': 'general',
            'tags': [],
            'relevance_score': 0.3,
            'summary': discovery['description'][:100]
        }

    def save_discovery(self, discovery, classification):
        """Guardar descubrimiento en base de datos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Crear hash único
        content_hash = hashlib.md5(
            f"{discovery['title']}{discovery['url']}".encode()
        ).hexdigest()
        
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO discoveries 
                (title, url, description, source, category, tags, relevance_score, hash)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                discovery['title'],
                discovery['url'],
                classification['summary'],
                discovery['source'],
                classification['category'],
                json.dumps(classification['tags']),
                classification['relevance_score'],
                content_hash
            ))
            
            conn.commit()
            
        except sqlite3.IntegrityError:
            pass  # Ya existe
        
        conn.close()

    def update_trends(self, discoveries):
        """Actualizar tendencias basadas en descubrimientos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Extraer keywords de títulos
        all_text = ' '.join([d['title'] for d in discoveries]).lower()
        words = all_text.split()
        
        # Contar frecuencias
        word_freq = {}
        for word in words:
            if len(word) > 3:  # Filtrar palabras cortas
                word_freq[word] = word_freq.get(word, 0) + 1
        
        # Actualizar base de datos
        for word, freq in word_freq.items():
            cursor.execute('''
                INSERT OR REPLACE INTO trends (keyword, frequency, last_seen, trend_score)
                VALUES (?, ?, ?, ?)
            ''', (word, freq, datetime.now(), freq * 0.1))
        
        conn.commit()
        conn.close()

    def get_trending_topics(self, limit=10):
        """Obtener temas trending"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT keyword, frequency, trend_score 
            FROM trends 
            WHERE last_seen > datetime('now', '-7 days')
            ORDER BY trend_score DESC 
            LIMIT ?
        ''', (limit,))
        
        trends = cursor.fetchall()
        conn.close()
        
        return trends

    def generate_report(self):
        """Generar reporte de tendencias"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Estadísticas generales
        cursor.execute('SELECT COUNT(*) FROM discoveries')
        total_discoveries = cursor.fetchone()[0]
        
        cursor.execute('''
            SELECT category, COUNT(*) 
            FROM discoveries 
            WHERE created_at > datetime('now', '-7 days')
            GROUP BY category
        ''')
        weekly_by_category = cursor.fetchall()
        
        # Top fuentes
        cursor.execute('''
            SELECT source, COUNT(*) 
            FROM discoveries 
            WHERE created_at > datetime('now', '-7 days')
            GROUP BY source 
            ORDER BY COUNT(*) DESC 
            LIMIT 5
        ''')
        top_sources = cursor.fetchall()
        
        conn.close()
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_discoveries': total_discoveries,
            'weekly_by_category': dict(weekly_by_category),
            'top_sources': dict(top_sources),
            'trending_topics': self.get_trending_topics()
        }
        
        return report

    def run_scan(self):
        """Ejecutar escaneo completo"""
        self.logger.info("🚀 Iniciando escaneo de tendencias...")
        
        # Escanear fuentes
        rss_discoveries = self.scan_rss_feeds()
        api_discoveries = self.scan_api_sources()
        
        all_discoveries = rss_discoveries + api_discoveries
        self.logger.info(f"📊 Encontrados {len(all_discoveries)} descubrimientos")
        
        # Procesar y guardar
        for discovery in all_discoveries:
            classification = self.classify_with_ai(discovery)
            self.save_discovery(discovery, classification)
        
        # Actualizar tendencias
        self.update_trends(all_discoveries)
        
        # Generar reporte
        report = self.generate_report()
        
        # Guardar reporte
        with open(f'trend_report_{datetime.now().strftime("%Y%m%d_%H%M")}.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        self.logger.info("✅ Escaneo completado")
        return report

    def start_scheduler(self):
        """Iniciar programador automático"""
        # Escaneos programados
        schedule.every().hour.do(self.run_scan)  # Cada hora
        schedule.every().day.at("09:00").do(self.generate_daily_report)  # Reporte diario
        schedule.every().week.do(self.cleanup_old_data)  # Limpieza semanal
        
        self.logger.info("📅 Programador iniciado")
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Verificar cada minuto

    def generate_daily_report(self):
        """Generar reporte diario"""
        report = self.generate_report()
        
        # Enviar por email o webhook
        self.logger.info("📧 Reporte diario generado")
        return report

    def cleanup_old_data(self):
        """Limpiar datos antiguos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Eliminar descubrimientos antiguos (>30 días)
        cursor.execute('''
            DELETE FROM discoveries 
            WHERE created_at < datetime('now', '-30 days')
        ''')
        
        # Eliminar tendencias antiguas (>7 días)
        cursor.execute('''
            DELETE FROM trends 
            WHERE last_seen < datetime('now', '-7 days')
        ''')
        
        conn.commit()
        conn.close()
        
        self.logger.info("🧹 Limpieza de datos completada")

if __name__ == "__main__":
    tracker = TrendTracker()
    
    # Ejecutar escaneo único
    if len(sys.argv) > 1 and sys.argv[1] == "--scan":
        report = tracker.run_scan()
        print(json.dumps(report, indent=2))
    else:
        # Iniciar programador automático
        tracker.start_scheduler()