export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Expense Sorter') 
    .addItem('Screen App', 'openDialogTailwindCSS')
    .addItem('Sidebar App', 'openAboutSidebar')
    .addItem('Configuration', 'openConfigSidebar');

  menu.addToUi();
};

export const openDialogTailwindCSS = () => {
  const html = HtmlService.createHtmlOutputFromFile('main-screen')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html,'');
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('main-screen');
  SpreadsheetApp.getUi().showSidebar(html);
};

export const openConfigSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('config-screen');
  SpreadsheetApp.getUi().showSidebar(html);
};

