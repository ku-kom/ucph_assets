<?php

/**
 * Icon Registry
 */

 defined('TYPO3') or die('Access denied.');

return [
    // icon identifier
    'ucph_assets_icon' => [
        'provider' => \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
        'source' => 'EXT:ucph_assets/Resources/Public/Icons/Extension.svg',
    ],
];
