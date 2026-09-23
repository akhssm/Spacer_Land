// One sample project so the viewer has something to show before the
// Projects API exists (Milestone 2). Real projects will come from MongoDB.

const BROCHURE_PAGE_COUNT = 8

export const SAMPLE_PROJECT = {
  shortCode: 'demo',
  name: 'Green Meadows',
  city: 'Hyderabad',
  brochure: {
    // One image per page. Real brochures will be PDFs converted to page images on the server.
    pages: Array.from(
      { length: BROCHURE_PAGE_COUNT },
      (_, index) => `/sample/brochure/page-${index + 1}.svg`,
    ),
  },
}
