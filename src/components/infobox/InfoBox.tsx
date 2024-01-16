import * as React from "react";

import { InfoLabel, InfoLabelProps, Link } from "@fluentui/react-components";

export const InfoBox = (props: Partial<InfoLabelProps>) => (
  <InfoLabel
    info={
      <>
        This is example information for an InfoLabel.{" "}
        <Link href="https://react.fluentui.dev">Learn more</Link>
      </>
    }
    {...props}
  >
  </InfoLabel>
);
