"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlert = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@material-ui/core");
var styles_1 = require("@material-ui/core/styles");
var useStyles = (0, styles_1.makeStyles)(function (theme) { return ({
    root: {
        padding: theme.spacing(3),
    },
}); });
var CreateAlert = function () {
    var classes = useStyles();
    return (<div className={classes.root}>
      <core_1.Card>
        <core_1.CardContent>
          <core_1.Typography variant="h5" component="h2" gutterBottom>
            Create New Alert
          </core_1.Typography>
          <core_1.Typography variant="body1" color="textSecondary">
            This feature is coming soon. You will be able to create new monitoring alerts here.
          </core_1.Typography>
        </core_1.CardContent>
      </core_1.Card>
    </div>);
};
exports.CreateAlert = CreateAlert;
