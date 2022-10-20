import React from "react";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Link(props) {
  const openInNewTabProps = props.newTab
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <MuiLink
      //   underline="hover"
      component={RouterLink}
      to={props.to ?? ""}
      color={props.color}
      variant={props.variant}
      sx={props.sx}
      {...openInNewTabProps}
    >
      {props.children}
    </MuiLink>
  );
}

export default Link;
