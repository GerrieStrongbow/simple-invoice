import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { InvoiceData } from './types'

export class PDFGenerator {
  private invoiceData: InvoiceData

  constructor(invoiceData: InvoiceData) {
    this.invoiceData = invoiceData
  }

  // Generate PDF from HTML element
  async generateFromHTML(element: HTMLElement, filename?: string): Promise<void> {
    if (!element) {
      throw new Error('Invoice content is not available for export.')
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale for better compatibility
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        ignoreElements: (el) => {
          // Check for no-print class
          if (el.classList.contains('no-print')) return true
          
          // Check for button elements
          if (el.tagName === 'BUTTON') return true
          if (el.getAttribute('type') === 'button') return true
          // Some read-only fields use role="button" for accessibility; allow them to render
          
          // Check for interactive elements that shouldn't be in PDF
          // Do not filter cursor-pointer/hover classes; invoice fields rely on them for read mode styling
          
          // Check if any parent element has no-print class
          let parent = el.parentElement
          while (parent) {
            if (parent.classList?.contains('no-print')) return true
            parent = parent.parentElement
          }
          
          // Check for specific selectors and dropdowns
          if (el.tagName === 'SELECT') return true
          if (el.classList.contains('absolute')) return true
          if (el.classList.contains('opacity-0')) return true
          
          return false
        }
      })

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Invoice preview is empty or hidden. Please make sure the invoice is visible and try again.')
      }

      const imgData = canvas.toDataURL('image/png')
      
      if (imgData.length < 1000) {
        throw new Error('Unable to capture invoice content. Try again or use the browser print option.')
      }
      
      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Generate filename
      const invoiceNumber = this.invoiceData.header.invoiceNumber || 'Invoice'
      const defaultFilename = `${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      pdf.save(filename || defaultFilename)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('PDF generation failed for an unknown reason.')
    }
  }

  // Simple fallback - just use browser print
  async generateFallback(): Promise<void> {
    window.print()
  }
}
