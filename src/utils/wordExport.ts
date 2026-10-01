import type { ResumeData } from '../types';

export function exportToWord(data: ResumeData) {
  const primaryColor = data.design.primaryColor || '#7C3AED';
  const fullLocation = [data.city, data.state].filter(Boolean).join(' – ');

  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Currículo - ${data.name || 'Sem Nome'}</title>
  <style>
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #333333;
      margin: 30pt;
    }
    h1 {
      font-size: 22pt;
      color: ${primaryColor};
      margin-bottom: 2pt;
      margin-top: 0;
      text-transform: uppercase;
      font-weight: bold;
    }
    .subtitle {
      font-size: 12pt;
      color: #555555;
      font-weight: bold;
      margin-bottom: 8pt;
    }
    .contact {
      font-size: 9.5pt;
      color: #666666;
      margin-bottom: 16pt;
      padding-bottom: 8pt;
      border-bottom: 1.5pt solid ${primaryColor};
    }
    h2 {
      font-size: 12pt;
      color: ${primaryColor};
      border-bottom: 1.5pt solid ${primaryColor};
      padding-bottom: 3pt;
      margin-top: 16pt;
      margin-bottom: 8pt;
      text-transform: uppercase;
      font-weight: bold;
    }
    .item-title {
      font-weight: bold;
      font-size: 11pt;
      color: #111111;
    }
    .item-subtitle {
      font-weight: bold;
      color: ${primaryColor};
      font-size: 10pt;
    }
    .item-date {
      font-size: 9pt;
      color: #777777;
    }
    .description {
      font-size: 10pt;
      color: #444444;
      margin-top: 4pt;
      margin-bottom: 10pt;
    }
    .skill-chip {
      display: inline-block;
      background-color: #F3F4F6;
      border: 1pt solid #E5E7EB;
      padding: 3pt 8pt;
      margin-right: 4pt;
      margin-bottom: 4pt;
      border-radius: 4pt;
      font-size: 9.5pt;
      color: #1F2937;
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <h1>${data.name || 'Seu Nome Completo'}</h1>
  ${data.jobTitle ? `<div class="subtitle">${data.jobTitle}</div>` : ''}

  <div class="contact">
    ${[
      data.email ? `E-mail: ${data.email}` : '',
      data.phone ? `Telefone: ${data.phone}` : '',
      fullLocation ? `Localização: ${fullLocation}` : '',
      data.enabledPersonalFields.linkedin && data.linkedin ? `LinkedIn: ${data.linkedin}` : '',
      data.enabledPersonalFields.github && data.github ? `GitHub: ${data.github}` : '',
      data.enabledPersonalFields.portfolio && data.portfolio ? `Portfólio: ${data.portfolio}` : '',
    ]
      .filter(Boolean)
      .join(' | ')}
  </div>

  <!-- RESUMO PROFISSIONAL -->
  ${
    data.enabledSections.summary && data.summary
      ? `
    <h2>Resumo Profissional</h2>
    <div class="description">${data.summary.replace(/\n/g, '<br/>')}</div>
  `
      : ''
  }

  <!-- EXPERIÊNCIA PROFISSIONAL -->
  ${
    data.enabledSections.experience && data.experience.some((e) => e.role || e.company)
      ? `
    <h2>Experiência Profissional</h2>
    ${data.experience
      .filter((e) => e.role || e.company)
      .map(
        (exp) => `
      <div style="margin-bottom: 12pt;">
        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
          <tr>
            <td align="left" class="item-title">${exp.role || '—'}</td>
            <td align="right" class="item-date">${exp.startDate || ''} ${exp.startDate || exp.endDate ? '–' : ''} ${exp.current ? 'Atual' : exp.endDate || ''}</td>
          </tr>
        </table>
        <div class="item-subtitle">${exp.company}</div>
        ${exp.description ? `<div class="description">${exp.description.replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `
      )
      .join('')}
  `
      : ''
  }

  <!-- FORMAÇÃO ACADÊMICA -->
  ${
    data.enabledSections.education && data.education.some((e) => e.course || e.institution)
      ? `
    <h2>Formação Acadêmica</h2>
    ${data.education
      .filter((e) => e.course || e.institution)
      .map(
        (edu) => `
      <div style="margin-bottom: 8pt;">
        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
          <tr>
            <td align="left" class="item-title">${edu.degree} ${edu.course ? `– ${edu.course}` : ''}</td>
            <td align="right" class="item-date">${edu.year || ''}</td>
          </tr>
        </table>
        <div style="font-size: 10pt; color: #555;">${edu.institution} ${edu.period ? `(${edu.period})` : ''}</div>
      </div>
    `
      )
      .join('')}
  `
      : ''
  }

  <!-- COMPETÊNCIAS -->
  ${
    data.enabledSections.skills && (data.hardSkills.length > 0 || data.softSkills.length > 0)
      ? `
    <h2>Competências & Habilidades</h2>
    ${
      data.hardSkills.length > 0
        ? `<p><strong>Habilidades Técnicas:</strong> ${data.hardSkills.join(', ')}</p>`
        : ''
    }
    ${
      data.softSkills.length > 0
        ? `<p><strong>Competências Comportamentais:</strong> ${data.softSkills.join(', ')}</p>`
        : ''
    }
  `
      : ''
  }

  <!-- IDIOMAS -->
  ${
    data.enabledSections.languages && data.languages.some((l) => l.name)
      ? `
    <h2>Idiomas</h2>
    <p>${data.languages
      .filter((l) => l.name)
      .map((l) => `<strong>${l.name}:</strong> ${l.level || 'Não especificado'}`)
      .join(' | ')}</p>
  `
      : ''
  }

  <!-- CERTIFICADOS -->
  ${
    data.enabledSections.certifications && data.certifications.some((c) => c.name)
      ? `
    <h2>Certificações & Cursos</h2>
    ${data.certifications
      .filter((c) => c.name)
      .map(
        (cert) => `
      <p style="margin-bottom: 4pt;">
        <strong>${cert.name}</strong> ${cert.issuer ? `— ${cert.issuer}` : ''} ${cert.year ? `(${cert.year})` : ''}
      </p>
    `
      )
      .join('')}
  `
      : ''
  }

  <!-- PROJETOS -->
  ${
    data.enabledSections.projects && data.projects.some((p) => p.title)
      ? `
    <h2>Projetos & Realizações</h2>
    ${data.projects
      .filter((p) => p.title)
      .map(
        (proj) => `
      <div style="margin-bottom: 8pt;">
        <div class="item-title">${proj.title} ${proj.link ? `(${proj.link})` : ''}</div>
        ${proj.description ? `<div class="description">${proj.description}</div>` : ''}
      </div>
    `
      )
      .join('')}
  `
      : ''
  }

  <!-- SEÇÃO PERSONALIZADA -->
  ${
    data.enabledSections.custom && data.customSections.some((cs) => cs.title)
      ? data.customSections
          .filter((cs) => cs.title)
          .map(
            (cs) => `
      <h2>${cs.title}</h2>
      <div class="description">${cs.description.replace(/\n/g, '<br/>')}</div>
    `
          )
          .join('')
      : ''
  }
</body>
</html>
  `;

  // Create Blob with Word Document MIME type
  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });

  // Trigger browser file download
  const cleanName = (data.name || '').trim().replace(/[\\/:*?"<>|]/g, '_');
  const fileName = cleanName ? `${cleanName}.doc` : 'Curriculo_Profissional.doc';
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
