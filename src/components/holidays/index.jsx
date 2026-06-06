import HolidaysGlobalSchemas   from './GlobalSchemas'
import SectionFAQ              from './SectionFAQ'

export default function HolidaysSections() {
  return (
    <>
      <HolidaysGlobalSchemas />
      <SectionFAQ />
    </>
  )
}

export { default as HolidaysGlobalSchemas }   from './GlobalSchemas'
export { default as SectionFAQ }              from './SectionFAQ'
