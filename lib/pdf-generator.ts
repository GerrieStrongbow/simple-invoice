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
    try {
      console.log('Starting PDF generation...')
      console.log('Element:', element)
      console.log('Element dimensions:', element.scrollWidth, 'x', element.scrollHeight)

      // Create canvas from HTML element with simplified options
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale for better compatibility
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true, // Enable logging for debugging
        width: element.scrollWidth,
        height: element.scrollHeight,
        ignoreElements: (el) => {
          // Check for no-print class
          if (el.classList.contains('no-print')) return true
          
          // Check for button elements
          if (el.tagName === 'BUTTON') return true
          if (el.getAttribute('type') === 'button') return true
          if (el.getAttribute('role') === 'button') return true
          
          // Check for interactive elements that shouldn't be in PDF
          if (el.classList.contains('cursor-pointer')) return true
          if (el.classList.contains('hover:bg-gray-50')) return true
          if (el.classList.contains('hover:bg-blue-700')) return true
          if (el.classList.contains('hover:bg-red-50')) return true
          
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

      console.log('Canvas created:', canvas.width, 'x', canvas.height)

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions - element may be hidden or empty')
      }

      const imgData = canvas.toDataURL('image/png')
      console.log('Image data length:', imgData.length)
      
      if (imgData.length < 1000) {
        throw new Error('Generated image data is too small - capture may have failed')
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
      
      console.log('Saving PDF as:', defaultFilename)
      
      // Download PDF
      pdf.save(filename || defaultFilename)
      console.log('PDF generation completed successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try the Print button instead.`)
      throw error
    }
  }

  // Simple fallback - just use browser print
  async generateFallback(): Promise<void> {
    window.print()
  }
}