# 📄 Curriculinho - Gerador e Otimizador de Currículos com IA

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

O **Curriculinho** é uma aplicação web moderna, acessível e intuitiva para criação, personalização e otimização de currículos profissionais. Inspirado na experiência de usuário do *Jobseeker.com* e validado com boas práticas de **Recursos Humanos (RH)** e leitores **ATS (Applicant Tracking Systems)**, o sistema utiliza Inteligência Artificial para ajudar candidatos a destacarem suas conquistas e conseguirem mais entrevistas.

---

## ✨ Principais Funcionalidades

### 📱 1. Interface em Abas (Baixa Carga Cognitiva)
- **Aba Conteúdo:** Formulário organizado em *Accordions* (sanfonas) colapsáveis para preenchimento modular e sem poluição visual.
- **Aba Design & Layout:** Personalização de fontes, espaçamentos, cores e alternância entre layouts **Compacto (1 Folha)** ou **Completo (Sem Limite)**.
- **Aba Pré-visualização:** Visualização do currículo em tempo real com controles de zoom e exportação instantânea.

### 🤖 2. Assistentes de Inteligência Artificial & Menu Hambúrguer (Drawer)
- **Score de Saúde do Currículo:** Análise em tempo real da completude e qualidade das informações.
- **Metodologia STAR:** Assistente interativo para estruturar experiências no formato **S**ituação, **T**arefa, **A**ção e **R**esultado.
- **Validador & Otimizador ATS:** Comparação da síntese do currículo com palavras-chave da vaga desejada.
- **Gerador de Resumo Profissional:** Síntese inteligente baseada no histórico de carreira.
- **Tradução Automática:** Conversão do currículo para múltiplos idiomas.

### 👥 3. Recursos Ajustados com Insights de RH
- **Seleção Dinâmica UF & Cidade:** Filtro encadeado de estados e cidades brasileiras.
- **Módulo de Foto com Disclaimer de RH:** Upload opcional com aviso sobre viés e recomendações modernas de recrutamento.
- **Vídeo Apresentação (Pitch):** Indexação de vídeos do YouTube com guia de ajuda `(?)` integrado.
- **Tecnologias Dominadas & Skills Customizadas:** Adição flexível de Hard Skills, Soft Skills e tecnologias fora das listas padrão.
- **Projetos & Realizações Ampliados:** Suporte a arquivos PDF e múltiplos links de portfólio (Behance, Figma, Drive, GitHub).
- **Dicas Visuais & Tooltips `(?)`:** Botões explicativos integrados para orientar o candidato sobre termos técnicos.
- **Design P&B Recomendado:** Orientação de uso da paleta Preto e Branco para máxima legibilidade em robôs ATS e impressão.

### 📥 4. Importação e Exportação Flexíveis
- **Importação:** Suporte a arquivos PDF existentes, perfis do LinkedIn, JSON ou integração Canva.
- **Exportação:** Baixe em **PDF profissional**, arquivo **Word (`.docx`)** editável ou backup em **JSON**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Formatação:** [Oxfmt](https://github.com/oxc-project/oxc)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18+ recomendada)
- **pnpm**, **npm** ou **yarn**

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/Deivison13245/Curriculinho.git
   cd Curriculinho
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar no navegador:**
   Abra [http://localhost:5173](http://localhost:5173) (ou a porta indicada pelo Vite no seu terminal).

---

## 📜 Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

- `npm run dev`: Inicia o servidor de desenvolvimento Vite.
- `npm run build`: Compila o projeto otimizado para produção.
- `npm run preview`: Executa a versão de produção localmente para testes.
- `npm run deploy`: Realiza o deploy automático para o **GitHub Pages**.
- `npm run format`: Formata o código do projeto utilizando o `oxfmt`.

---

## 📖 Como Usar a Aplicação (Guia Rápido)

1. **Preencha seus dados na Aba Conteúdo:**
   - Comece pelos *Dados Pessoais*, selecionando seu **Estado (UF)** e **Cidade**.
   - Adicione suas *Experiências* e use a ajuda da **IA (Metodologia STAR)** para descrever suas conquistas.
   - Adicione suas *Competências*, *Tecnologias Dominadas* e *Idiomas*.
2. **Personalize na Aba Design:**
   - Escolha o modelo (**Compacto** para 1 folha ou **Completo**).
   - Defina a cor de destaque (recomendado **Preto e Branco** para testes em ATS).
3. **Use os Assistentes no Menu Hambúrguer (☰):**
   - Acesse o **Score de Saúde** para verificar itens pendentes.
   - Execute a **Otimização ATS** fornecendo a descrição da vaga pretendida.
4. **Exporte seu Currículo:**
   - Clique no botão `⬇ Baixar PDF` no canto inferior direito ou acesse as opções de exportação para Word (`.docx`).

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/NovaFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Faça o Push para a Branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e profissionais. Sinta-se à vontade para utilizar e adaptar para suas necessidades.
