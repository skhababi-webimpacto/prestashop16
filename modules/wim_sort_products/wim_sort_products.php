<?php
/**
 * Created by PhpStorm.
 * User: YV-01-040
 * Date: 29/11/2018
 * Time: 13:07
 */

/* These two lines are very important for making available all Prestashop functions and classes */
// include(dirname(__FILE__).'../../config/config.inc.php');
// include(dirname(__FILE__).'../../init.php');

if (!defined('_PS_VERSION_')) {
    exit;
}

class wim_sort_products extends Module

{
  // private $id_product = null;

    public function __construct()
    {
        /* Initilize the product id at loading this module */

        // $this->id_product = $idproduct;

        $this->name = 'wim_sort_products';
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

        $this->displayName = $this->l('Wim Sort Products');
        $this->description = $this->l('Module to sort products by most sold in category page');

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
            !$this->registerHook('actionValidateOrder') ||
            // !$this->registerHook('displayProductTabContent') ||
            // !$this->registerHook('actionMostSold')||

            /* Add two fields to table: ps_product */
             !Db::getInstance()->execute('ALTER TABLE '. _DB_PREFIX_.'product ADD number_sales INT(10) NULL')||
             !Db::getInstance()->execute('ALTER TABLE '. _DB_PREFIX_.'product ADD number_sales_updated DATE NULL')||
             !Configuration::updateValue('DAYSAGO', '0')

           /* !$this->registerHook('leftColumn') ||*/
            /*!$this->registerHook('header') ||*/

        ){
            return false;
        }

        return true;
    }
    /* Uninstall function */
    public function uninstall()
    {
        if (!parent::uninstall() ||
            !Configuration::deleteByName('MYMODULE_NAME')||
            !Db::getInstance()->execute('ALTER TABLE '. _DB_PREFIX_.'product DROP number_sales')||
            !Db::getInstance()->execute('ALTER TABLE '. _DB_PREFIX_.'product DROP number_sales_updated')
        ) {
            return false;
        }

        return true;
    }

    /* Returns or does whatever in the place where the module is hooked */

    public function hookActionValidateOrder($params)
    {   /* Execute the check number of products sold for each product */
         // Db::getInstance()->execute('UPDATE ps_product SET id_supplier = 125 WHERE id_product = 27');

        // Db::getInstance()->execute('UPDATE ps_product SET number_sales = 1 AND number_sales_updated = 2 WHERE id_product = '.$params['id_product']);

        $daysago = (int)Configuration::get('DAYSAGO'); /* Devuelve un string ! Hay que convertirlo a int */

        $products = $params['order']->product_list;

        foreach($products as $product){

            $prod = new Product($product['id_product']);
            // Db::getInstance()->execute('UPDATE ps_product SET id_supplier = 1 WHERE id_product = '.$product['id_product']);
            $prod->number_sales = $prod->getNumberSales($daysago);
            $prod->numberSalesUpdated();

        }

    }
    /*****************************************************************/

    /* getContent function is needed for displaying the 'Configuration' button */
    public function getContent(){
        $output = null;

        if (Tools::isSubmit('submit'.$this->name)) {
            $daysago = strval(Tools::getValue('DAYSAGO')); /*Tools::getValue() gets the value from $_GET or $_POST*/

            if (
                !$daysago ||
                empty($daysago) ||
                !Validate::isGenericName($daysago)
            ) {
                $output .= $this->displayError($this->l('Invalid Configuration value'));
            } else {
            //  Product::updateDaysAgo($daysago);
                Configuration::updateValue('DAYSAGO',$daysago);
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
                    'label' => $this->l('Number of days ago'),
                    'name' => 'DAYSAGO',
                    'size' => 20,
                    'required' => false
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
        $helper->fields_value['DAYSAGO'] = Configuration::get('DAYSAGO');


        return $helper->generateForm($fieldsForm);
    }
}