const vscode = require('vscode');

class MultiAgentChat {
    constructor() {
        this.panel = null;
    }

    createPanel() {
        this.panel = vscode.window.createWebviewPanel(
            'multiAgentChat',
            'Multi-Agent Chat',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        this.panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; margin: 0; padding: 10px; }
                .chat { height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
                .message { margin: 5px 0; padding: 8px; border-radius: 5px; }
                .user { background: #007acc; color: white; text-align: right; }
                .agent { background: #f0f0f0; }
                .input-area { display: flex; gap: 10px; }
                input { flex: 1; padding: 8px; }
                button { padding: 8px 15px; background: #007acc; color: white; border: none; border-radius: 3px; }
                .agents { margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="agents">
                <label><input type="checkbox" id="amazonq" checked> Amazon Q</label>
                <label><input type="checkbox" id="copilot"> Copilot</label>
                <label><input type="checkbox" id="gemini"> Gemini</label>
            </div>
            <div class="chat" id="chat"></div>
            <div class="input-area">
                <input type="text" id="messageInput" placeholder="Pregunta a los agentes...">
                <button onclick="sendMessage()">Enviar</button>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                
                function sendMessage() {
                    const input = document.getElementById('messageInput');
                    const message = input.value.trim();
                    if (!message) return;
                    
                    addMessage('user', message);
                    vscode.postMessage({ command: 'sendToAgents', message });
                    input.value = '';
                }
                
                function addMessage(sender, text) {
                    const chat = document.getElementById('chat');
                    const div = document.createElement('div');
                    div.className = 'message ' + sender;
                    div.textContent = text;
                    chat.appendChild(div);
                    chat.scrollTop = chat.scrollHeight;
                }
                
                window.addEventListener('message', event => {
                    const { command, agent, response } = event.data;
                    if (command === 'agentResponse') {
                        addMessage('agent', agent + ': ' + response);
                    }
                });
            </script>
        </body>
        </html>`;

        this.panel.webview.onDidReceiveMessage(async message => {
            if (message.command === 'sendToAgents') {
                this.routeToAgents(message.message);
            }
        });
    }

    async routeToAgents(userMessage) {
        // Send to all active agents and collect responses
        const responses = [];
        
        // Amazon Q (simulate reading from current session)
        responses.push(await this.getAmazonQResponse(userMessage));
        
        // Copilot integration
        if (this.isAgentActive('copilot')) {
            responses.push(await this.getCopilotResponse(userMessage));
        }
        
        // Gemini integration
        if (this.isAgentActive('gemini')) {
            responses.push(await this.callGemini(userMessage));
        }
        
        // Process all responses and generate collaborative answer
        this.processCollaborativeResponse(userMessage, responses);
    }
    
    isAgentActive(agent) {
        // Check if agent checkbox is selected
        return true; // Simplified for now
    }
    
    async getAmazonQResponse(message) {
        // Simulate reading Amazon Q response from current session
        return {
            agent: 'Amazon Q',
            response: `Analizando "${message}" en contexto de Asistencia Vial...`
        };
    }
    
    async getCopilotResponse(message) {
        try {
            // Trigger Copilot and simulate response reading
            await vscode.commands.executeCommand('github.copilot.interactiveSession.start');
            return {
                agent: 'Copilot',
                response: `Código sugerido para: ${message}`
            };
        } catch (error) {
            return {
                agent: 'Copilot',
                response: 'Error: Copilot no disponible'
            };
        }
    }
    
    processCollaborativeResponse(originalMessage, responses) {
        // Display individual responses
        responses.forEach(resp => {
            this.panel.webview.postMessage({
                command: 'agentResponse',
                agent: resp.agent,
                response: resp.response
            });
        });
        
        // Generate collaborative synthesis
        const synthesis = this.synthesizeResponses(originalMessage, responses);
        this.panel.webview.postMessage({
            command: 'agentResponse',
            agent: 'Síntesis Colaborativa',
            response: synthesis
        });
    }
    
    synthesizeResponses(message, responses) {
        const validResponses = responses.filter(r => !r.response.includes('Error'));
        
        if (validResponses.length === 0) {
            return 'No se pudieron obtener respuestas válidas.';
        }
        
        return `Basándome en las respuestas de ${validResponses.map(r => r.agent).join(', ')}:\n\n` +
               `Para "${message}" en Asistencia Vial, la mejor aproximación combina:\n` +
               validResponses.map(r => `• ${r.agent}: ${r.response.substring(0, 100)}...`).join('\n');
    }

    async callGemini(message) {
        const apiKey = 'AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g';
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });
            
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
            
            this.panel.webview.postMessage({
                command: 'agentResponse',
                agent: 'Gemini',
                response: reply
            });
        } catch (error) {
            this.panel.webview.postMessage({
                command: 'agentResponse',
                agent: 'Gemini',
                response: 'Error de conexión'
            });
        }
    }
}

function activate(context) {
    const multiAgent = new MultiAgentChat();
    
    const disposable = vscode.commands.registerCommand('multiAgent.openChat', () => {
        multiAgent.createPanel();
    });
    
    context.subscriptions.push(disposable);
}

module.exports = { activate };