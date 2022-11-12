import * as React from "react";
import {
  Box,
  Stack,
  ListItem,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Icons from "../components/icons";
import StyledButton from "./button";
import { useGlobalState } from "../demo-data/auth_provider";

const StyledCourseListTile = styled(ListItem)(({ theme }) => ({
  padding: 0,
  "& .courseListTileHeader": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    color: theme.palette.neutral.darkest,
  },
}));

const LabelItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    gap: theme.spacing(2),
    fontSize: 14,
    "& svg": {
      height: 18,
    },
  },
  gap: theme.spacing(1),
  fontSize: 12,
  "& svg": {
    height: 16,
    width: "auto",
    fill: theme.palette.neutral.lightest,
  },
}));

export default function CourseListTile({
  course: { courseCode, courseName, academicYear, lecturer },
}) {
  const [state, dispatch] = useGlobalState();
  const [star, setStar] = React.useState(false);
  const theme = useTheme();
  const isSmallOrLess = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    setStar(
      state.stars.indexOf({
        courseCode: courseCode,
        academicYear: academicYear,
      }) !== -1
    );
  }, []);

  const stared = () => {
    setStar((prev) => !prev);
    if (star)
      dispatch({
        stars: [
          ...state.stars,
          { courseCode: courseCode, academicYear: academicYear },
        ],
      });
    else
      dispatch({
        stars: state.stars.filter(
          (obj) =>
            obj.courseCode === courseCode && obj.academicYear === academicYear
        ),
      });
  };
  return (
    <StyledCourseListTile>
      <ListItemButton
        sx={{ borderRadius: 2, py: { xs: 3, sm: 4, md: 6 } }}
        component={Link}
        to={`/courses/${courseCode}/${academicYear}`}
      >
        <Stack spacing={3} direction="column" width="100%">
          <div className="courseListTileHeader">
            <h4 style={{ fontWeight: 600 }}>
              {courseCode} {courseName}
            </h4>
          </div>
          <Stack
            spacing={{ xs: 2, md: 4 }}
            direction="row"
            sx={{ mt: 3, flexWrap: "wrap" }}
          >
            {lecturer && (
              <LabelItem>
                <Icons.UserIcon />
                {lecturer}
              </LabelItem>
            )}
            {academicYear && (
              <LabelItem>
                <Icons.HistoryIcon />
                {academicYear % 2 == 0
                  ? `${academicYear}-${academicYear + 1}`
                  : `${academicYear - 1}-${academicYear}`}
              </LabelItem>
            )}
          </Stack>
        </Stack>
      </ListItemButton>
      <StyledButton
        variant="contained"
        size={isSmallOrLess ? "small" : "medium"}
        onClick={() => stared()}
        startIcon={!star ? <Icons.StarEmptyIcon /> : <Icons.StarFillIcon />}
      >
        <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>Star</Box>
      </StyledButton>
    </StyledCourseListTile>
  );
}
