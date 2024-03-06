<?php

namespace App\Utils;


use PhpOffice\PhpWord\Element\Link;
use PhpOffice\PhpWord\Exception\Exception as PhpWordException;

/**
 * Extension of TemplateProcessor to add in new links.
 */

// namespace could be specified here

use PhpOffice\PhpWord\TemplateProcessor;

class ExtendedTemplateProcessor extends TemplateProcessor
{
    private $tempDocumentRelationships;
    private $xmlRelationships;

    public function __construct($documentTemplate)
    {
        // Construct as normal for the parent class.
        parent::__construct($documentTemplate);

        // Get the current relationships from the 'rel' file.
        $this->tempDocumentRelationships = $this->zipClass->getFromName($this->getRelsName());

        // Create an array to store PHPWord links objects in.
        $this->links = array();

        // Store the current links in the template as an XML object.
        $this->xmlRelationships = simplexml_load_string($this->tempDocumentRelationships);

    }

    /**
     * Overwrite save() method to add in updating of relationships.
     *
     * @return string
     */
    public function save()
    {
        $this->tempDocumentRelations['word/document.xml'] = $this->xmlRelationships->asXML();

        return parent::save();
    }



    /**
     * Add links to the link object.
     *
     * @param $link
     *   PHPWord link object
     */
    public function addLink($link)
    {
        $this->xmlRelationships = simplexml_load_string($this->tempDocumentRelations['word/document.xml']);

        // This is not tested, but I think there might not be an entry in the
        // relationships file for internal links.
        if ($link->isInternal()) {
            return;
        }

        // Set the relationship id number for the link.
        $next_rid = $this->getNextRid();

        // PHPWord adds 6 to the rId because it assumes we are starting
        // from a blank document that has the 6 default rIds in it.
        // We need to compensate for this.
        $link_rid_num = $next_rid - 6;

        // Set the relationship id for the PHPWord link object.
        $link->setRelationId($link_rid_num);

        // Add link as relationship in XML relationships.
        $xml_child = $this->xmlRelationships->addChild('Relationship');

        $xml_child->addAttribute('Id', 'rId' . $next_rid);
        $xml_child->addAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink');
        $xml_child->addAttribute('Target', $link->getSource());
        $xml_child->addAttribute('TargetMode', 'External');

    }


    /**
     * Function to add multiple links.
     *
     * @param $link
     *   A PHPWord link object (returned when using addLink).
     *   These need to be passed to the template processor so the
     *   links relationship file can be updated.
     */
    public function addLinks($links)
    {
        $this->xmlRelationships = simplexml_load_string($this->tempDocumentRelations['word/document.xml']);

        foreach ($links as $link) {
            $this->addLink($link);
        }
    }


    /**
     * Return the number of the next Rid.
     *
     * @return int
     */
    public function getNextRid()
    {
        // Loop through the current links and get the latest number.
        $link_nums = array();
        foreach ($this->xmlRelationships as $xmlRelationship) {
            $attributes = $xmlRelationship->attributes();
            if (isset($attributes['Id'])) {
                if (substr($attributes['Id'], 0, 3) == 'rId') {
                    $link_nums[] = intval(substr($attributes['Id'], 3));
                }
            }
        }

        return max($link_nums) + 1;

    }


    /**
     * Get the name of the rel file for $index.
     *
     * This is presumed to always be constant unlike footer parts that
     * can have sequential numbers.
     *
     * @return string
     */
    protected function getRelsName()
    {
        return 'word/_rels/document.xml.rels';
    }

}