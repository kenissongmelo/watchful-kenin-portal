"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeninDutyLogsPage = void 0;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var RealTimeLogs_1 = require("./RealTimeLogs");
var KeninDutyLogsPage = function () { return (<material_1.Box sx={{ p: 3 }}>
    <RealTimeLogs_1.RealTimeLogs />
  </material_1.Box>); };
exports.KeninDutyLogsPage = KeninDutyLogsPage;
