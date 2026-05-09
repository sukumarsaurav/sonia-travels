import { Section } from '@/components/ui/Section'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { FAQS } from '@/lib/data'

export function FAQSection() {
  return (
    <Section eyebrow="Common questions" title="Before you book.">
      <FAQAccordion items={FAQS}/>
    </Section>
  )
}
