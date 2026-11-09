import os
import zipfile
import xml.sax.saxutils as saxutils

def generate_docx(md_path, docx_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    paragraphs = []
    
    # Process text into paragraphs with basic styles
    in_table = False
    table_rows = []

    for raw_line in lines:
        line = raw_line.strip()
        
        # Table detection
        if line.startswith('|') and line.endswith('|'):
            if '---' in line:
                continue # delimiter row
            cols = [c.strip() for c in line[1:-1].split('|')]
            table_rows.append(cols)
            in_table = True
            continue
        else:
            if in_table:
                # Flush table
                paragraphs.append({'type': 'table', 'rows': table_rows})
                table_rows = []
                in_table = False

        if not line:
            paragraphs.append({'type': 'spacing'})
            continue

        if line.startswith('# '):
            paragraphs.append({'type': 'h1', 'text': line[2:].strip()})
        elif line.startswith('## '):
            paragraphs.append({'type': 'h2', 'text': line[3:].strip()})
        elif line.startswith('### '):
            paragraphs.append({'type': 'h3', 'text': line[4:].strip()})
        elif line.startswith('* ') or line.startswith('- '):
            paragraphs.append({'type': 'bullet', 'text': line[2:].strip()})
        elif line.startswith('1. ') or line.startswith('2. ') or line.startswith('3. ') or line.startswith('4. ') or line.startswith('5. '):
            paragraphs.append({'type': 'numbered', 'text': line[3:].strip()})
        elif line.startswith('```'):
            continue # code fences
        else:
            paragraphs.append({'type': 'p', 'text': line})

    if in_table:
        paragraphs.append({'type': 'table', 'rows': table_rows})

    # Build word/document.xml
    body_xml = []

    for item in paragraphs:
        t = item['type']
        if t == 'spacing':
            # small spacing paragraph
            body_xml.append('<w:p><w:pPr><w:spacing w:after="100"/></w:pPr></w:p>')
        elif t == 'h1':
            text = saxutils.escape(item['text'])
            body_xml.append(f'''
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading1"/>
                    <w:spacing w:before="240" w:after="120"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:b/>
                        <w:sz w:val="24"/>
                        <w:szCs w:val="24"/>
                        <w:color w:val="003366"/>
                    </w:rPr>
                    <w:t>{text}</w:t>
                </w:r>
            </w:p>''')
        elif t == 'h2':
            text = saxutils.escape(item['text'])
            body_xml.append(f'''
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                    <w:spacing w:before="200" w:after="100"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:b/>
                        <w:sz w:val="24"/>
                        <w:szCs w:val="24"/>
                        <w:color w:val="004080"/>
                    </w:rPr>
                    <w:t>{text}</w:t>
                </w:r>
            </w:p>''')
        elif t == 'h3':
            text = saxutils.escape(item['text'])
            body_xml.append(f'''
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                    <w:spacing w:before="160" w:after="80"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:b/>
                        <w:sz w:val="24"/>
                        <w:szCs w:val="24"/>
                        <w:color w:val="222222"/>
                    </w:rPr>
                    <w:t>{text}</w:t>
                </w:r>
            </w:p>''')
        elif t in ('bullet', 'numbered'):
            raw_text = item['text']
            prefix = '•  ' if t == 'bullet' else ''
            
            # Simple bold handler inside text (e.g. **Bold**: rest)
            parts = raw_text.split('**')
            runs_xml = []
            if prefix:
                runs_xml.append(f'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">{prefix}</w:t></w:r>')
            
            is_bold = False
            for part in parts:
                if not part:
                    is_bold = not is_bold
                    continue
                escaped = saxutils.escape(part)
                b_tag = '<w:b/>' if is_bold else ''
                runs_xml.append(f'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>{b_tag}<w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t xml:space="preserve">{escaped}</w:t></w:r>')
                is_bold = not is_bold

            body_xml.append(f'''
            <w:p>
                <w:pPr>
                    <w:ind w:left="420" w:hanging="240"/>
                    <w:spacing w:before="60" w:after="60" w:line="276" w:lineRule="auto"/>
                    <w:jc w:val="both"/>
                </w:pPr>
                {''.join(runs_xml)}
            </w:p>''')
        elif t == 'p':
            raw_text = item['text']
            parts = raw_text.split('**')
            runs_xml = []
            is_bold = False
            for part in parts:
                if not part:
                    is_bold = not is_bold
                    continue
                escaped = saxutils.escape(part)
                b_tag = '<w:b/>' if is_bold else ''
                runs_xml.append(f'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>{b_tag}<w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t xml:space="preserve">{escaped}</w:t></w:r>')
                is_bold = not is_bold

            body_xml.append(f'''
            <w:p>
                <w:pPr>
                    <w:spacing w:before="60" w:after="100" w:line="276" w:lineRule="auto"/>
                    <w:jc w:val="both"/>
                </w:pPr>
                {''.join(runs_xml)}
            </w:p>''')
        elif t == 'table':
            rows_xml = []
            for r_idx, row in enumerate(item['rows']):
                cells_xml = []
                for cell in row:
                    escaped_cell = saxutils.escape(cell.replace('**', ''))
                    is_head = (r_idx == 0)
                    b_tag = '<w:b/>' if is_head else ''
                    shd_tag = '<w:shd w:val="clear" w:color="auto" w:fill="F0F4F8"/>' if is_head else ''
                    cells_xml.append(f'''
                    <w:tc>
                        <w:tcPr>
                            <w:tcBorders>
                                <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                                <w:left w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                                <w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                            </w:tcBorders>
                            {shd_tag}
                            <w:tcMar>
                                <w:top w:w="120" w:type="dxa"/>
                                <w:left w:w="160" w:type="dxa"/>
                                <w:bottom w:w="120" w:type="dxa"/>
                                <w:right w:w="160" w:type="dxa"/>
                            </w:tcMar>
                        </w:tcPr>
                        <w:p>
                            <w:pPr>
                                <w:spacing w:before="40" w:after="40"/>
                            </w:pPr>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                                    {b_tag}
                                    <w:sz w:val="22"/>
                                    <w:szCs w:val="22"/>
                                </w:rPr>
                                <w:t>{escaped_cell}</w:t>
                            </w:r>
                        </w:p>
                    </w:tc>''')
                rows_xml.append(f'<w:tr>{ "".join(cells_xml) }</w:tr>')
            
            body_xml.append(f'''
            <w:tbl>
                <w:tblPr>
                    <w:tblW w:w="9600" w:type="dxa"/>
                    <w:tblBorders>
                        <w:top w:val="single" w:sz="6" w:space="0" w:color="AAAAAA"/>
                        <w:left w:val="single" w:sz="6" w:space="0" w:color="AAAAAA"/>
                        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="AAAAAA"/>
                        <w:right w:val="single" w:sz="6" w:space="0" w:color="AAAAAA"/>
                    </w:tblBorders>
                </w:tblPr>
                {''.join(rows_xml)}
            </w:tbl>''')

    # Page setup: A4, 2cm margins (1134 dxa)
    sectPr = '''
    <w:sectPr>
        <w:pgSz w:w="11906" w:h="16838"/>
        <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
        <w:cols w:space="708"/>
        <w:docGrid w:linePitch="360"/>
    </w:sectPr>'''

    doc_xml_content = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
            {''.join(body_xml)}
            {sectPr}
        </w:body>
    </w:document>'''

    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Default Extension="xml" ContentType="application/xml"/>
        <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    </Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    </Relationships>'''

    with zipfile.ZipFile(docx_path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('word/document.xml', doc_xml_content)

if __name__ == '__main__':
    generate_docx('Wesleson_Souza_RNP.md', 'Wesleson_Souza_RNP.docx')
    print("DOCX generated successfully!")

