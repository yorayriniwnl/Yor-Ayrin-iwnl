import LazyBasicScene from "../../components/3d/LazyBasicScene";
import Section from '../../components/ui/Section'
import Card from '../../components/ui/Card'
import { BodyText, Eyebrow, Heading } from '../../components/ui/Typography'

export default function Page() {
  return (
    <Section>
      <Eyebrow>3D Demo</Eyebrow>
      <Heading className="mt-4 mb-3">Rotating Cube</Heading>
      <BodyText className="mb-8">
        Minimal React Three Fiber scene, now framed with the same premium shell and
        content surface styling.
      </BodyText>
      <Card>
        <LazyBasicScene height={480} />
      </Card>
    </Section>
  );
}
