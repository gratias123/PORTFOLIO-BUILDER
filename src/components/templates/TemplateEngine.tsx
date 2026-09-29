import React from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { TemplateProfessional } from './TemplateProfessional';
import { TemplateCreative } from './TemplateCreative';
import { TemplateTech } from './TemplateTech';
import { TemplateMinimalist } from './TemplateMinimalist';

interface TemplateEngineProps {
  data: FullPortfolioData;
  isInteractive?: boolean;
}

export const TemplateEngine: React.FC<TemplateEngineProps> = ({ data, isInteractive = true }) => {
  const templateId = data.settings.templateId || 'professional';

  switch (templateId) {
    case 'minimalist':
      return <TemplateMinimalist data={data} isInteractive={isInteractive} />;
    case 'creative':
      return <TemplateCreative data={data} isInteractive={isInteractive} />;
    case 'tech':
      return <TemplateTech data={data} isInteractive={isInteractive} />;
    case 'corporate':
    case 'professional':
    default:
      return <TemplateProfessional data={data} isInteractive={isInteractive} />;
  }
};
