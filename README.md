# Sistema Clube dos Taberneiros para FoundryVTT

![Sistema Clube dos Taberneiros](https://img.shields.io/badge/FoundryVTT-v13-orange)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

Um sistema completo de RPG para FoundryVTT baseado no **Livro do Jogador** do Sistema Clube dos Taberneiros. Este sistema implementa uma mecânica elegante de 2d6 + Atributo vs ND com quatro atributos fundamentais, oferecendo simplicidade sem sacrificar profundidade tática.

## 🎲 Características Principais

### ⚡ Mecânica Simples e Elegante
- **Sistema Unificado**: 2d6 + Atributo vs Número de Dificuldade para todas as resoluções
- **Críticos com Duplas**: Resultados especiais quando ambos os dados mostram o mesmo número
- **Escala de Dificuldades**: 6 níveis de dificuldade de Trivial (ND 5) a Heroica (ND 15)

### 🏛️ Quatro Atributos Fundamentais
- **Físico**: Força, resistência e capacidade atlética
- **Ação**: Agilidade, reflexos e coordenação motora  
- **Mental**: Inteligência, raciocínio e capacidade de aprendizado
- **Social**: Carisma, lideranças e habilidade de comunicação

### ⚔️ Sistema de Combate Dinâmico
- **Ataques**: Físico para corpo a corpo, Ação para à distância
- **Defesa Calculada**: 10 + Ação + modificadores de armadura
- **Críticos Especiais**: Duplas altas para sucessos críticos, duplas baixas para falhas críticas
- **Condições de Status**: Sistema completo de condições que afetam gameplay

### 🧙‍♂️ Sistema de Magia Robusto
- **6 Escolas de Magia**: Evocação, Abjuração, Transmutação, Ilusão, Divinação, Necromancia
- **Pontos de Magia**: Mental × 2 + 5, recuperados por descanso
- **Magias de Nível 1-6**: Progressão de poder clara
- **Componentes**: Verbais, Somáticos e Materiais

### 🎯 Classes Equilibradas
- **Guerreiro**: Especialista em combate e proteção
- **Mago**: Manipulador das forças arcanas
- **Ladino**: Mestre da furtividade e precisão
- **Diplomata**: Expert em interações sociais

### 🧝‍♀️ Diversidade Racial
- **6 Raças Jogáveis**: Humanos, Elfos, Anões, Halflings, Tieflings, Goblins
- **Modificadores Únicos**: Cada raça oferece bônus e habilidades especiais
- **Balanceamento**: Todas as raças são viáveis para qualquer classe

## 🚀 Instalação

### Método 1: Via Interface do FoundryVTT
1. Abra o FoundryVTT
2. Vá para "Configuration and Setup"
3. Clique em "Game Systems" 
4. Clique em "Install System"
5. Cole a URL do manifest: `https://raw.githubusercontent.com/clube-dos-taberneiros/foundry-system/main/system.json`
6. Clique em "Install"

### Método 2: Manual
1. Baixe o arquivo ZIP do sistema
2. Extraia na pasta `Data/systems/clube-dos-taberneiros/` do FoundryVTT
3. Reinicie o FoundryVTT
4. Crie um novo mundo usando o "Sistema Clube dos Taberneiros"

## 📋 Funcionalidades Implementadas

### ✅ Mecânicas Básicas
- [x] Sistema de testes 2d6 + Atributo vs ND
- [x] Críticos com duplas nos dados
- [x] Cálculo automático de valores derivados (PV, PM, Defesa)
- [x] Sistema de condições e modificadores

### ✅ Personagens
- [x] Criação completa de personagens
- [x] 4 classes com habilidades únicas
- [x] 6 raças com modificadores especiais
- [x] Sistema de progressão por XP
- [x] Ficha de personagem com abas organizadas

### ✅ Combate
- [x] Sistema de iniciativa baseado em Ação
- [x] Ataques corpo a corpo e à distância
- [x] Aplicação automática de dano
- [x] Condições de status com efeitos mecânicos
- [x] Manobras especiais de combate

### ✅ Magia
- [x] 6 escolas de magia implementadas
- [x] Sistema de Pontos de Magia
- [x] Magias de nível 1-6
- [x] Verificação automática de PM
- [x] Efeitos de magias básicas

### ✅ Equipamentos
- [x] Sistema completo de armas, armaduras e equipamentos
- [x] Equipar/desequipar com modificadores automáticos
- [x] Inventário com controle de peso
- [x] Itens mágicos e consumíveis
- [x] Sistema monetário (Ouro, Prata, Cobre)

### ✅ Interface
- [x] Ficha de personagem moderna e responsiva
- [x] Templates de chat estilizados
- [x] Tooltips informativos
- [x] Temas visuais customizáveis
- [x] Localização completa em português

## 🎮 Como Usar

### Criando um Personagem
1. Crie um novo Ator do tipo "Personagem"
2. Distribua 16 pontos entre os 4 atributos (mín. 3, máx. 8)
3. Escolha uma raça e classe
4. Selecione habilidades iniciais
5. Compre equipamentos com 100 Moedas de Prata iniciais

### Realizando Testes
- **Clique nos atributos** para rolagem rápida (ND 9)
- **Shift + Clique** abre dialog com opções avançadas
- **Críticos**: Duplas altas (4-4, 5-5, 6-6) = Sucesso Crítico
- **Falhas Críticas**: Duplas baixas (1-1, 2-2, 3-3) = Falha Crítica

### Combate
1. Role iniciativa (2d6 + Ação)
2. Declare ações em ordem de iniciativa
3. **Atacar**: Clique no ícone de espada nas armas
4. **Conjurar**: Clique no ícone de magia nas magias
5. **Aplicar Condições**: Use checkboxes na aba principal

### Descanso
- **Descanso Curto**: +1 PV e +1 PM
- **Descanso Longo**: Físico PV recuperados, PM completo, condições removidas

## ⚙️ Configurações

O sistema oferece diversas opções de configuração:

### Automação
- Aplicação automática de dano
- Verificação automática de PM
- Atualização automática de recursos
- Aplicação de modificadores raciais

### Interface
- Tooltips detalhados
- Temas visuais
- Exibição de defesa de inimigos
- Ajuda para novos usuários

### Combate
- Críticos avançados
- Aplicação automática de modificadores
- Verificação de pré-requisitos

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
clube-dos-taberneiros-foundry/
├── module/
│   ├── documents/          # Classes de Actor e Item
│   ├── sheets/             # Fichas de personagem e item
│   ├── helpers/            # Funções auxiliares
│   └── apps/               # Dialogs e aplicações
├── templates/
│   ├── actor/              # Templates de fichas
│   ├── chat/               # Templates de chat
│   └── apps/               # Templates de dialogs
├── styles/                 # CSS do sistema
├── lang/                   # Arquivos de localização
└── system.json             # Configuração do sistema
```

### Contribuindo
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📖 Documentação Adicional

### Links Úteis
- [Livro do Jogador Original](link-para-livro)
- [Wiki do Sistema](link-para-wiki)
- [Discord da Comunidade](link-para-discord)
- [Reportar Bugs](link-para-issues)

### Roadmap
- [ ] Sistema de criação de personagem guiado
- [ ] Mais automações de combate
- [ ] Sistema de talentos avançados
- [ ] Integração com módulos populares
- [ ] Compêndios de conteúdo
- [ ] Gerador de NPCs
- [ ] Sistema de reputação

## 🐛 Bugs Conhecidos

Nenhum bug crítico conhecido no momento. Reporte problemas na [página de issues](link-para-issues).

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Créditos

### Desenvolvimento
- **Sistema Original**: Clube dos Taberneiros
- **Implementação FoundryVTT**: [Seu Nome]
- **Arte e Design**: Clube dos Taberneiros

### Agradecimentos
- Comunidade FoundryVTT pelo suporte e feedback
- Atropos pelos incríveis Foundation APIs
- Comunidade Clube dos Taberneiros pelo sistema original

---

## 📞 Suporte

Para suporte, bugs ou sugestões:
- 🐛 [Issues no GitHub](link-para-issues)
- 💬 [Discord da Comunidade](link-para-discord)
- 📧 Email: [seu-email]

**Que suas aventuras sejam épicas! 🎲⚔️🧙‍♀️** 