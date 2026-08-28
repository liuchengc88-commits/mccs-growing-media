from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "mccs-molded-coir-substrate-technical-data-sheet.pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4
GREEN = colors.HexColor("#173A25")
ACTION_GREEN = colors.HexColor("#0E6C38")
PALE_GREEN = colors.HexColor("#EAF2E8")
INK = colors.HexColor("#243228")
MUTED = colors.HexColor("#556354")
LINE = colors.HexColor("#D8DED6")
PAPER = colors.HexColor("#F7F5EC")
BLUE = colors.HexColor("#274F78")
AMBER = colors.HexColor("#765618")


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverEyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=ACTION_GREEN, spaceAfter=6))
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=28, leading=31, textColor=GREEN, alignment=TA_LEFT, spaceAfter=12))
styles.add(ParagraphStyle(name="CoverLead", parent=styles["Normal"], fontSize=12, leading=18, textColor=MUTED, spaceAfter=16))
styles.add(ParagraphStyle(name="SectionTitle", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=GREEN, spaceBefore=6, spaceAfter=10))
styles.add(ParagraphStyle(name="SubTitle", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=GREEN, spaceBefore=4, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyMCCS", parent=styles["BodyText"], fontSize=9.4, leading=14, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name="SmallMCCS", parent=styles["BodyText"], fontSize=7.8, leading=10.5, textColor=MUTED))
styles.add(ParagraphStyle(name="TableHead", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.6, leading=9.5, textColor=GREEN))
styles.add(ParagraphStyle(name="TableCell", parent=styles["BodyText"], fontSize=7.2, leading=9.4, textColor=INK))
styles.add(ParagraphStyle(name="TableCellStrong", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.2, leading=9.4, textColor=GREEN))
styles.add(ParagraphStyle(name="StatusPublished", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=6.8, leading=8.5, textColor=ACTION_GREEN))
styles.add(ParagraphStyle(name="StatusReport", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=6.8, leading=8.5, textColor=BLUE))
styles.add(ParagraphStyle(name="StatusTrial", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=6.8, leading=8.5, textColor=AMBER))
styles.add(ParagraphStyle(name="Contact", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=10, leading=15, textColor=colors.white, alignment=TA_CENTER))


def P(text, style="BodyMCCS"):
    return Paragraph(text, styles[style])


def draw_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.rect(0, PAGE_HEIGHT - 14 * mm, PAGE_WIDTH, 14 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(18 * mm, PAGE_HEIGHT - 9 * mm, "MCCS GROWING MEDIA")
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(PAGE_WIDTH - 18 * mm, PAGE_HEIGHT - 9 * mm, "Molded Coir Substrate Technical Data Sheet")
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, PAGE_WIDTH - 18 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(18 * mm, 9 * mm, "mccsgrowingmedia.com  |  sales@mccsgrowingmedia.com")
    canvas.drawRightString(PAGE_WIDTH - 18 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def disclosure_box(label, description, color):
    return Table(
        [[P(label, "TableCellStrong"), P(description, "SmallMCCS")]],
        colWidths=[28 * mm, 117 * mm],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ("BOX", (0, 0), (-1, -1), 0.6, LINE),
            ("LINEBEFORE", (0, 0), (0, -1), 3, color),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]),
    )


def technical_rows():
    return [
        ("Material composition", "PUBLISHED", "Molded coconut coir and peat substrate with adjustable plant-fiber binder ratio.", "Final formulation is project-specific.", "Share crop, tray, irrigation and handling requirements."),
        ("Dry density", "BATCH REPORT", "No universal density is published.", "State dry basis, specimen volume and conditioning method.", "Agree the method before requesting a value."),
        ("Wet density", "BATCH REPORT", "Moisture condition must accompany the result.", "Record saturation, drainage time and sample geometry.", "Provide target handling moisture and tray format."),
        ("Air-filled porosity (AFP)", "SAMPLE TRIAL", "Model and protocol dependent.", "Use an agreed saturation, drainage and calculation method.", "Define target AFP and root-zone operating range."),
        ("Water-holding capacity (WHC)", "SAMPLE TRIAL", "Model and protocol dependent.", "State sample volume, saturation and drainage conditions.", "Validate against irrigation interval and crop demand."),
        ("Water-to-air ratio", "SAMPLE TRIAL", "Calculated from agreed AFP and WHC results.", "Use the same specimen and protocol for both inputs.", "Set an acceptance window with the grower or agronomist."),
        ("EC value", "BATCH REPORT", "Current-batch result available by agreed scope.", "Extraction ratio and water quality must be stated.", "Specify the required method, such as a 1:1.5 extraction."),
        ("pH range", "BATCH REPORT", "Current-batch result available by agreed scope.", "Extraction method, soak time and temperature must be stated.", "Provide crop and nutrient-program acceptance range."),
        ("Sodium (Na+) and chloride (Cl-)", "BATCH REPORT", "Exact ppm values are not universal claims.", "Include ions in the agreed analytical scope and report units.", "Request the applicable report for the proposed batch."),
        ("Buffer or wash treatment", "PROJECT SPEC", "Treatment status is confirmed per quotation or batch specification.", "Do not infer treatment from a generic product-family description.", "List required treatment and acceptable residual ions."),
        ("Rehydration under pressure", "SAMPLE TRIAL", "No universal time is published.", "Record model, pressure, emitter pattern, water temperature and wet dimensions.", "Provide target pressure and maximum cycle time."),
        ("Mechanical strength / crumble", "SAMPLE TRIAL", "No universal gripper threshold is published.", "Test target moisture, jaw geometry, pressure and cycle rate.", "Share automation settings and acceptance threshold."),
        ("Particle-size distribution", "PROJECT SPEC", "Formulation-specific.", "State sieve method, fractions and conditioning basis.", "Request the distribution for the approved formulation."),
    ]


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    frame = Frame(18 * mm, 17 * mm, PAGE_WIDTH - 36 * mm, PAGE_HEIGHT - 34 * mm, id="content")
    doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=17 * mm, title="MCCS Molded Coir Substrate Technical Data Sheet", author="MCCS Growing Media", subject="Technical disclosure and sample validation framework for molded coir and peat substrate plugs")
    doc.addPageTemplates([PageTemplate(id="MCCS", frames=[frame], onPage=draw_header_footer)])

    story = []
    story.extend([
        Spacer(1, 13 * mm),
        P("TECHNICAL DATA SHEET  |  B2B PROCUREMENT EDITION", "CoverEyebrow"),
        P("MCCS Molded Coir and Peat Substrate Plugs", "CoverTitle"),
        P("A structured disclosure and validation framework for commercial greenhouse, hydroponic, nursery, orchid and tissue-culture sourcing teams.", "CoverLead"),
    ])
    cover_table = Table([
        [P("Product family", "TableCellStrong"), P("MCCS ZY Series molded coir and peat substrate plugs", "TableCell")],
        [P("Supply model", "TableCellStrong"), P("Factory-direct B2B supply with export coordination", "TableCell")],
        [P("Technical evidence", "TableCellStrong"), P("SGS report information available for eligible project review; confirm scope and applicability with sales", "TableCell")],
        [P("Capacity reference", "TableCellStrong"), P("Up to 100,000 individual molded substrate units per day under full-line operation; actual output depends on model, packaging and production schedule", "TableCell")],
        [P("Document status", "TableCellStrong"), P("Property values labeled as published, batch/project report or sample-trial dependent", "TableCell")],
        [P("Issue date", "TableCellStrong"), P("August 2026", "TableCell")],
    ], colWidths=[38 * mm, 112 * mm])
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PALE_GREEN),
        ("BACKGROUND", (1, 0), (1, -1), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.6, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story.extend([cover_table, Spacer(1, 9 * mm), P("How to read this document", "SectionTitle")])
    story.extend([
        disclosure_box("PUBLISHED", "Approved product-family or site information that can be cited directly.", ACTION_GREEN),
        Spacer(1, 3 * mm),
        disclosure_box("BATCH / PROJECT", "A current result or treatment status supplied for an agreed analytical or commercial scope.", BLUE),
        Spacer(1, 3 * mm),
        disclosure_box("SAMPLE TRIAL", "A property that must be validated against the buyer's model, equipment and operating conditions.", AMBER),
        Spacer(1, 8 * mm),
        P("Important evidence boundary", "SubTitle"),
        P("This sheet does not convert unverified certifications, universal EC or pH limits, fixed ion thresholds, a universal gripper crumble rate, or guaranteed rehydration and shelf-life performance into product-family claims. Numeric acceptance criteria should be written into the approved project specification only after the relevant evidence or trial is reviewed."),
        PageBreak(),
        P("Technical Property Disclosure Matrix", "SectionTitle"),
        P("The matrix converts common buyer questions into explicit evidence and validation requirements. It is designed to prevent a generic family claim from being mistaken for a batch certificate or machine-compatibility guarantee."),
    ])

    table_data = [[P("Property", "TableHead"), P("Status / Disclosure", "TableHead"), P("Test or Validation Basis", "TableHead"), P("Buyer Action", "TableHead")]]
    for prop, status, disclosure, basis, action in technical_rows():
        table_data.append([
            P(prop, "TableCellStrong"),
            P(f"<b>{status}</b><br/>{disclosure}", "TableCell"),
            P(basis, "TableCell"),
            P(action, "TableCell"),
        ])
    technical_table = LongTable(table_data, colWidths=[34 * mm, 47 * mm, 43 * mm, 43 * mm], repeatRows=1)
    technical_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PALE_GREEN),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAFBF8")]),
    ]))
    story.extend([Spacer(1, 2 * mm), technical_table, PageBreak()])

    story.extend([
        P("Machine Compatibility Review", "SectionTitle"),
        P("Compatibility is confirmed against the buyer's equipment and moisture window. It should not be inferred from a tray cell count or product-family name."),
    ])
    machine_table = Table([
        [P("Tray and cavity fit", "TableCellStrong"), P("Submit cavity width, depth, taper, drainage opening and dimensional tolerance. Check both dry and hydrated fit.", "TableCell")],
        [P("Pneumatic grippers", "TableCellStrong"), P("Provide jaw profile, grip pressure, dwell time, line speed and target moisture. Record visible damage, crumble loss and transfer consistency.", "TableCell")],
        [P("Drainage and air pruning", "TableCellStrong"), P("Confirm bottom clearance and drainage geometry with the actual tray drawing. Validate crop- and system-specific root-zone behavior.", "TableCell")],
        [P("Irrigation cycle", "TableCellStrong"), P("Record water pressure, emitter pattern, water temperature, time to wetting and final wet dimensions for the selected model.", "TableCell")],
    ], colWidths=[42 * mm, 108 * mm])
    machine_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PALE_GREEN),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([machine_table, Spacer(1, 7 * mm), P("Ten high-intent validation scenarios", "SectionTitle")])
    scenarios = [
        ("1. Rehydration at 1.2 bar", "No universal time is published. Record model, initial moisture, water temperature, emitter coverage, time to full wetting and final wet dimensions."),
        ("2. Gripper crumble below 0.5%", "No universal below-0.5% guarantee is published. Test the proposed 55-65% moisture window with buyer-supplied jaw geometry, pressure and cycle rate."),
        ("3. Wilting over 36-42 hours", "No universal claim is made. Validate crop stage, root mass, radiation, humidity, airflow, nutrient EC, initial saturation and block geometry."),
        ("4. Vertical AFP gradient below 4%", "No universal threshold is published. Agree saturation, drainage, sampling and calculation methods before top-versus-bottom testing."),
        ("5. Sodium, chloride and buffering", "Use exact ppm values from the applicable batch or project report. Confirm wash or buffer treatment in the approved quotation or specification."),
        ("6. pH drift within +/-0.2", "No universal guarantee is published. Define water alkalinity, extraction ratio, soak time, temperature and starting/final measurement method."),
        ("7. Storage for 18 months at 85% RH", "No universal claim is published. Confirm packaging, warehouse temperature, humidity control, pallet protection and project-specific shelf-life statement."),
        ("8. Ten-layer pallet compression", "No universal stacking or below-1.5% volume-loss claim is published. Review carton strength, compression duration, route climate and product format."),
        ("9. 128-cell tray fit and air pruning", "Submit the tray drawing and target model. Check dry fit, hydrated fit, drainage clearance and root-zone handling."),
        ("10. Reuse across three cropping cycles", "No universal decay rate is published. Define density, AFP, sanitation, root loading and structural-retention checkpoints for a multi-cycle trial."),
    ]
    scenario_data = [[P(title, "TableCellStrong"), P(text, "TableCell")] for title, text in scenarios]
    scenario_table = LongTable(scenario_data, colWidths=[48 * mm, 102 * mm])
    scenario_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#FAFBF8")),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.extend([scenario_table, PageBreak()])

    story.extend([
        P("Evidence, Documents and Approval Workflow", "SectionTitle"),
        P("MCCS uses a staged review so that model selection, evidence and operating tests remain traceable."),
    ])
    workflow = Table([
        [P("1", "TableCellStrong"), P("Application intake", "TableCellStrong"), P("Buyer provides crop, country, tray, monthly volume, irrigation and automation requirements.", "TableCell")],
        [P("2", "TableCellStrong"), P("Model and document review", "TableCellStrong"), P("MCCS identifies suitable ZY models and clarifies available SGS report information and project-specific technical fields.", "TableCell")],
        [P("3", "TableCellStrong"), P("Sample protocol", "TableCellStrong"), P("Both parties agree methods, environmental conditions and acceptance criteria before testing.", "TableCell")],
        [P("4", "TableCellStrong"), P("Commercial approval", "TableCellStrong"), P("Approved model, formulation, packaging, evidence scope and shipping plan are recorded in the quotation or specification.", "TableCell")],
    ], colWidths=[12 * mm, 40 * mm, 98 * mm])
    workflow.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PALE_GREEN),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.extend([
        workflow,
        Spacer(1, 8 * mm),
        P("Available buyer-facing evidence", "SectionTitle"),
        P("<b>SGS report support:</b> Available SGS report information can be shared during eligible buyer and project review. Confirm report scope and applicability with sales."),
        P("<b>Factory-direct supply:</b> Guangzhou-based production and export coordination for qualified B2B projects."),
        P("<b>Capacity planning:</b> Up to 100,000 individual molded substrate units per day under full-line operation. Actual output depends on model, formulation, packaging and production schedule."),
        P("<b>Research context:</b> A 2025 Agronomy PFAL study on molded coconut coir substrate under stated lettuce and pak choi test conditions: https://www.mdpi.com/2073-4395/15/8/1929"),
        Spacer(1, 7 * mm),
    ])
    contact = Table([[P("REQUEST A MODEL REVIEW OR SAMPLE PROTOCOL<br/>sales@mccsgrowingmedia.com  |  +86 189 2229 0417  |  www.mccsgrowingmedia.com/contact/", "Contact")]], colWidths=[150 * mm])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN),
        ("BOX", (0, 0), (-1, -1), 0.8, GREEN),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 13),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
    ]))
    story.extend([contact, Spacer(1, 6 * mm), P("This document is a technical disclosure framework, not a batch certificate. The approved quotation, project specification and applicable test report control the final commercial and technical requirements.", "SmallMCCS")])

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
