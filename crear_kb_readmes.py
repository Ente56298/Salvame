import os
import json
from pathlib import Path
from datetime import datetime


class KnowledgeBaseGenerator:
    """
    Escanea directorios en busca de archivos README.md y crea una base de conocimiento consolidada.
    """

    def __init__(self, root_dir, output_md, output_json):
        self.root_dir = Path(root_dir)
        self.output_md_path = Path(output_md)
        self.output_json_path = Path(output_json)
        self.knowledge_base = []

    def find_readmes(self):
        """Encuentra todos los archivos README.md recursivamente."""
        print(
            f"🔍 Escaneando '{self.root_dir}' en busca de archivos README.md..."
        )
        return self.root_dir.rglob('README.md')

    def process_readme(self, readme_path):
        """Lee y procesa el contenido de un archivo README.md."""
        try:
            with open(readme_path, 'r', encoding='utf-8',
                      errors='ignore') as f:
                content = f.read()

            readme_info = {
                "path":
                str(readme_path),
                "project_name":
                readme_path.parent.name,
                "content_preview":
                content[:200].strip() + "...",
                "last_modified":
                datetime.fromtimestamp(
                    readme_path.stat().st_mtime).isoformat()
            }
            self.knowledge_base.append(readme_info)
            return content
        except Exception as e:
            print(f"⚠️ Error leyendo {readme_path}: {e}")
            return None

    def generate_knowledge_base(self):
        """Genera los archivos consolidados de la base de conocimiento."""
        readme_files = self.find_readmes()

        md_content = "# 📚 Base de Conocimiento Unificada (READMEs)\n\n"
        md_content += f"Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        md_content += "--- \n\n"

        count = 0
        for readme_path in readme_files:
            count += 1
            print(f"  -> Procesando: {readme_path}")
            content = self.process_readme(readme_path)
            if content:
                md_content += f"## 📄 Proyecto: {readme_path.parent.name}\n\n"
                md_content += f"**Ubicación**: `{readme_path}`\n\n"
                md_content += "### Contenido:\n"
                md_content += f"```markdown\n{content}\n```\n\n"
                md_content += "---\n\n"

        # Guardar archivo Markdown
        with open(self.output_md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        # Guardar índice JSON
        with open(self.output_json_path, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_base, f, indent=4, ensure_ascii=False)

        print(f"\n✅ ¡Base de Conocimiento generada exitosamente!")
        print(f"📄 {count} archivos README.md procesados.")
        print(f"📖 Archivo principal: {self.output_md_path}")
        print(f"🗂️ Índice JSON: {self.output_json_path}")


if __name__ == "__main__":
    # Obtener el directorio donde se encuentra el script
    script_dir = Path(__file__).parent.resolve()

    generator = KnowledgeBaseGenerator(
        root_dir=script_dir,  # Escanear desde la raíz del script
        output_md=script_dir / "KNOWLEDGE_BASE_UNIFICADA.md",
        output_json=script_dir / "kb_readme_index.json")
    generator.generate_knowledge_base()
