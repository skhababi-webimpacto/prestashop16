<?php
/**
 * Created by PhpStorm.
 * User: YV-01-040
 * Date: 29/11/2018
 * Time: 13:07
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class MyHtmlSaved extends Module
{
    public function __construct()
    {
        $this->name = 'myhtmlsaved';
        $this->tab = 'others';
        $this->version = '1.3.0';
        $this->author = 'Said El Khababi';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = [
            'min' => '1.6',
            'max' => _PS_VERSION_
        ];
        $this->bootstrap = true;

        /* This call to the parent constructor must be done AFTER $this->name variable*/
        parent::__construct();
        /* This call to the parent constructor must be done BEFORE $this->l()*/

        $this->displayName = $this->l('My HTML Saved');
        $this->description = $this->l('My Module of Training');

        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?');

        if (!Configuration::get('MYMODULE_NAME')) {
            $this->warning = $this->l('No name provided');
        }
    }

    /* Install function */
    public function install()
    {
        if (Shop::isFeatureActive()) {
            Shop::setContext(Shop::CONTEXT_ALL);
        }

        if (!parent::install() ||
            !$this->registerHook('displayProductTabContent') ||
            !$this->registerHook('displaySaidHook') ||
           /* !$this->registerHook('leftColumn') ||*/
            /*!$this->registerHook('header') ||*/
            !Configuration::updateValue('MYMODULE_NAME', 'Mi nuevo nombre del Modulo')
        ) {
            return false;
        }

        return true;
    }
    /* Uninstall function */
    public function uninstall()
    {
        if (!parent::uninstall() ||
            !Configuration::deleteByName('MYMODULE_NAME')
        ) {
            return false;
        }

        return true;
    }

    /*
    public function hookDisplayHome(array $params)
    {
        return $this->hookLeftColumn($params);
    }
*/
    /*************************** OLD *********************************/
    /* function needed for the Hook to display the module content  */
     public function hookDisplayProductTabContent($params)
    {
        /*  return '<strong>Mi modulo: My HTML Saved - Said El Khababi</strong>';*/
         // return Configuration::get('MYMODULE_NAME');


        /******* IMPORTANT TO REMEMBER (assign + display tpl) ********/

        /* Assign the value to smarty in array of infos */
        $this->smarty->assign('modulename', Configuration::get('MYMODULE_NAME'));

        /* Return the template .tpl to display */
        return $this->display(__FILE__, 'myhtmlsaved.tpl');
    }
    /*************************** NEW *********************************/

    public function hookDisplaySaidHook($params)
    {
        /* return the same as the previous function */
        return $this->hookDisplayProductTabContent($params);

    }
    /*****************************************************************/

    /* getContent function is needed for displaying the 'Configuration' button */
    public function getContent(){
        $output = null;

        if (Tools::isSubmit('submit'.$this->name)) {
            $myModuleName = strval(Tools::getValue('MYMODULE_NAME'));

            if (
                !$myModuleName ||
                empty($myModuleName) ||
                !Validate::isGenericName($myModuleName)
            ) {
                $output .= $this->displayError($this->l('Invalid Configuration value'));
            } else {
                Configuration::updateValue('MYMODULE_NAME', $myModuleName);
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }
        }

        return $output.$this->displayForm();
    }


        /* displayForm function is user by the getContent function above, it displays the form inside the configuration page*/
    public function displayForm()
    {
        // Get default language
        $defaultLang = (int)Configuration::get('PS_LANG_DEFAULT');

        // Init Fields form array
        $fieldsForm[0]['form'] = [
            'legend' => [
                'title' => $this->l('Settings'),
            ],
            'input' => [
                [
                    'type' => 'text',
                    'label' => $this->l('Configuration value'),
                    'name' => 'MYMODULE_NAME',
                    'size' => 20,
                    'required' => true
                ]
            ],
            'submit' => [
                'title' => $this->l('Save'),
                'class' => 'btn btn-default pull-right'
            ]
        ];

        $helper = new HelperForm();

        // Module, token and currentIndex
        $helper->module = $this;
        $helper->name_controller = $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->currentIndex = AdminController::$currentIndex.'&configure='.$this->name;

        // Language
        $helper->default_form_language = $defaultLang;
        $helper->allow_employee_form_lang = $defaultLang;

        // Title and toolbar
        $helper->title = $this->displayName;
        $helper->show_toolbar = true;        // false -> remove toolbar
        $helper->toolbar_scroll = true;      // yes - > Toolbar is always visible on the top of the screen.
        $helper->submit_action = 'submit'.$this->name;
        $helper->toolbar_btn = [
            'save' => [
                'desc' => $this->l('Save'),
                'href' => AdminController::$currentIndex.'&configure='.$this->name.'&save'.$this->name.
                    '&token='.Tools::getAdminTokenLite('AdminModules'),
            ],
            'back' => [
                'href' => AdminController::$currentIndex.'&token='.Tools::getAdminTokenLite('AdminModules'),
                'desc' => $this->l('Back to list')
            ]
        ];

        // Load current value
        $helper->fields_value['MYMODULE_NAME'] = Configuration::get('MYMODULE_NAME');

        return $helper->generateForm($fieldsForm);
    }
}