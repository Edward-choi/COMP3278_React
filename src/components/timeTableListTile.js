import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import StyledButton from "./button";
import Icons from "./icons";

const ListTile = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: theme.spacing(2),
  position: "relative",
  borderRadius: theme.spacing(1),
  alignSelf: "stretch",
  flexGrow: 1,
  cursor: "pointer",
  ...(active && {
    backgroundColor: theme.palette.action.medium,
  }),
  ...(!active && {
    "&:hover": {
      backgroundColor: theme.palette.action.soft,
    },
  }),
  "& path": {
    fill: theme.palette.neutral.medium,
  },
  "& .startTime": {
    width: theme.breakpoints.up("md") ? 100 : theme.spacing(10),
    color: theme.palette.neutral.medium,
    fontSize: 14,
    flexShrink: 0,
  },
  "& .header": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    minWidth: "100%",
    flexGrow: 1,
    gap: theme.spacing(8),
  },
  "& .header .title": {
    fontSize: 16,
    fontWeight: 600,
    flexGrow: 1,
    color: theme.palette.neutral.darkest,
    workBreak: "break-word",
  },
  "& .labelWrapper": {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflowWrap: "break-word",
    textOverflow: "none",
    alignSelf: "stretch",
    gap: theme.spacing(2),
  },
  "& .labelWrapper .label": {
    display: "inline-flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    fontSize: 12,
    color: theme.palette.neutral.medium,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  "& .labelWrapper .label svg": { height: 12, width: "auto" },
}));

function TimetableListTile({
  course: {
    courseId,
    courseName,
    lecturer,
    venue,
    courseNumber,
    startAt,
    endAt,
    materials,
    messages,
  },
  active,
  selectCourse,
}) {
  let duration = () => {
    if (startAt && endAt) {
      var diffMs = endAt - startAt;
      return Math.round(diffMs / 60000);
    }
  };
  const renderStartAt = () => {
    if (startAt !== undefined && startAt !== null && "getHours" in startAt) {
      return `${startAt.getHours()}:${startAt.getMinutes()}`;
    }
  };
  return (
    <ListTile active={active} onClick={selectCourse} role="button">
      <div className="startTime">{renderStartAt()}</div>
      <Stack
        spacing={3}
        direction="column"
        sx={{ alignSelf: "stretch", flexGrow: 1, justifyContent: "flex-start" }}
      >
        <div className="header">
          <div className="title">
            {courseId} -- {courseName}
          </div>
          <Stack spacing={2} direction="row">
            {materials && materials.length > 0 && <Icons.StickyNoteIcon />}
            {messages && messages.length > 0 && <Icons.MessageIcon />}
          </Stack>
          <Stack
            spacing={2}
            direction="column"
            sx={{ textAlign: "right", minWidth: "fit-content" }}
          >
            <Box
              sx={{
                color: "neutral.darkest",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Lesson {courseNumber}
            </Box>
            <Box
              sx={{
                color: "neutral.medium",
                fontSize: 14,
              }}
            >
              {duration()} min
            </Box>
          </Stack>
        </div>
        <div className="labelWrapper">
          {lecturer && <div className="label">Lecturer: {lecturer}</div>}
          {venue && (
            <div className="label">
              <Icons.LocationFillIcon />
              {venue}
            </div>
          )}
        </div>
      </Stack>
    </ListTile>
  );
}

export default TimetableListTile;
