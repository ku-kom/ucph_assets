<?php

defined('TYPO3') or die('Access denied.');

call_user_func(function ($extKey='ucph_assets') {
    /**
     * Default TypoScript for UcphAssets
     */
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
        $extKey,
        'Configuration/TypoScript',
        'UCPH TYPO3 assets'
    );
});
