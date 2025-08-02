"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeninDutyRouter = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@material-ui/core");
var styles_1 = require("@material-ui/core/styles");
var Dashboard_1 = require("./Dashboard");
var Sidebar_1 = require("./Sidebar");
var useStyles = (0, styles_1.makeStyles)(function (theme) { return ({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    content: {
        display: 'flex',
        flex: 1,
    },
    main: {
        flex: 1,
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        marginBottom: theme.spacing(3),
    },
    title: {
        fontSize: '2rem',
        fontWeight: 600,
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1),
    },
    subtitle: {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
    },
}); });
var KeninDutyRouter = function () {
    var classes = useStyles();
    return (<div className={classes.root}>
      <div className={classes.content}>
        <Sidebar_1.Sidebar />
        <main className={classes.main}>
          <core_1.Container className={classes.container}>
            <div className={classes.header}>
              <core_1.Typography variant="h3" component="h1" className={classes.title}>
                KeninDuty
              </core_1.Typography>
              <core_1.Typography variant="body1" className={classes.subtitle}>
                Intelligent Alert Management Platform
              </core_1.Typography>
            </div>
            <Dashboard_1.Dashboard />
          </core_1.Container>
        </main>
      </div>
    </div>);
};
exports.KeninDutyRouter = KeninDutyRouter;
