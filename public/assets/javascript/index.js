(function init() {

  const main = function main() {
    loadTemplates();
    show('root', 'loading-template');
  };
  document.addEventListener('DOMContentLoaded', main);

  const cachedTemplates = {};
  const loadTemplates = function loadTemplatesFromDOM() {
    const templateNodes = document.querySelectorAll('script[type="text/x-handlebars-template"]');
    for (var i = 0; i < templateNodes.length; i++) {
      const el = templateNodes[i];
      const text = el.innerHTML;
      const id = el.id;
      cachedTemplates[id] = Handlebars.compile(text);
    }
  };

  const render = function renderCachedTemplate(templateId, replacements) {
    return cachedTemplates[templateId](replacements);
  };

  const show = function showRenderedTemplateInElement(rootId, templateId, data) {
    document.getElementById(rootId).innerHTML = render(templateId, data);
  };

})();
