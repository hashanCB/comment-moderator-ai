'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var debounce = require('lodash.debounce');
function useCommentCheck(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = options.context, context = _a === void 0 ? '' : _a, _b = options.threshold, threshold = _b === void 0 ? 0.7 : _b, _c = options.apiEndpoint, apiEndpoint = _c === void 0 ? '/api/check-comment' : _c, _d = options.debounceMs, debounceMs = _d === void 0 ? 500 : _d;
    var _e = react.useState(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = react.useState(null), result = _f[0], setResult = _f[1];
    var contextRef = react.useRef(context);
    var debouncedFnRef = react.useRef(null);
    // Update context if it changes
    react.useEffect(function () {
        contextRef.current = context;
    }, [context]);
    var checkComment = react.useCallback(function (commentText) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, result_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(commentText === null || commentText === void 0 ? void 0 : commentText.trim())) {
                        setResult({
                            approved: false,
                            reason: 'Comment cannot be empty',
                            confidence: 0
                        });
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(apiEndpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                comment: commentText,
                                context: contextRef.current,
                                threshold: threshold
                            })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.reason || 'Failed to check comment');
                    }
                    result_1 = __assign(__assign({}, data), { stats: {
                            length: commentText.length,
                            words: commentText.trim().split(/\s+/).length
                        } });
                    setResult(result_1);
                    return [2 /*return*/, result_1];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error checking comment:', err_1);
                    setResult({
                        approved: false,
                        reason: 'Failed to check comment. Please try again.',
                        confidence: 0
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiEndpoint, threshold]);
    // Initialize debounced function
    react.useEffect(function () {
        var debouncedFn = debounce(function (text) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkComment(text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, debounceMs);
        debouncedFnRef.current = debouncedFn;
        return function () {
            var _a, _b;
            if (debouncedFnRef.current) {
                // @ts-ignore - debounce types don't include cancel
                (_b = (_a = debouncedFnRef.current).cancel) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
        };
    }, [checkComment, debounceMs]);
    var debouncedCheck = react.useCallback(function (text) {
        var _a;
        if (!text)
            return;
        (_a = debouncedFnRef.current) === null || _a === void 0 ? void 0 : _a.call(debouncedFnRef, text);
    }, []);
    return {
        isLoading: isLoading,
        result: result,
        checkComment: checkComment,
        debouncedCheck: debouncedCheck
    };
}

var CommentChecker = /** @class */ (function () {
    function CommentChecker(apiKey, model) {
        if (model === void 0) { model = 'deepseek/deepseek-chat-v3-0324:free'; }
        this.model = model;
        if (!apiKey) {
            throw new Error('OpenRouter API key is required');
        }
        this.apiKey = apiKey;
    }
    CommentChecker.prototype.escapePrompt = function (input) {
        return input.replace(/["\\]/g, '\\$&');
    };
    CommentChecker.prototype.checkComment = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j;
        var comment = _a.comment, _k = _a.context, context = _k === void 0 ? '' : _k, _l = _a.threshold, threshold = _l === void 0 ? 0.7 : _l;
        return __awaiter(this, void 0, void 0, function () {
            var sanitizedContext, prompt_1, response, data, content, lines, approved, reason, confidence, error_1;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _m.trys.push([0, 3, , 4]);
                        if (!(comment === null || comment === void 0 ? void 0 : comment.trim())) {
                            return [2 /*return*/, {
                                    approved: false,
                                    reason: 'Comment is required',
                                    confidence: 0
                                }];
                        }
                        sanitizedContext = context.slice(0, 1000);
                        prompt_1 = sanitizedContext
                            ? "Context: ".concat(this.escapePrompt(sanitizedContext), "\n\nModerate the following comment: \"").concat(this.escapePrompt(comment), "\"\n\nConsider:\n1. Is it appropriate and relevant to the context? (Yes/No)\n2. Is it respectful and constructive? (Yes/No)\n3. Does it contain harmful content? (Yes/No)\n\nConfidence threshold: ").concat(threshold * 100, "%\n\nRespond with:\nAPPROVED: Yes/No\nREASON: <detailed reason>\nCONFIDENCE: <score between 0-1>")
                            : "Moderate the following comment: \"".concat(this.escapePrompt(comment), "\"...");
                        return [4 /*yield*/, fetch('https://openrouter.ai/api/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(this.apiKey),
                                    'Content-Type': 'application/json',
                                    'HTTP-Referer': 'https://github.com/livehashan/comment-check',
                                },
                                body: JSON.stringify({
                                    model: this.model,
                                    messages: [
                                        {
                                            role: 'system',
                                            content: 'You are a comment moderation assistant. Analyze comments and respond in the exact format: APPROVED: Yes/No\nREASON: <reason>\nCONFIDENCE: <0-1>'
                                        },
                                        {
                                            role: 'user',
                                            content: prompt_1
                                        }
                                    ],
                                    temperature: 0.3
                                })
                            })];
                    case 1:
                        response = _m.sent();
                        if (!response.ok) {
                            throw new Error('Failed to get response from OpenRouter');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _m.sent();
                        content = (_c = (_b = data.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                        if (!content) {
                            throw new Error('No response content from OpenRouter');
                        }
                        lines = content.trim().split('\n');
                        approved = ((_e = (_d = lines.find(function (line) { return line.startsWith('APPROVED:'); })) === null || _d === void 0 ? void 0 : _d.split(':')[1]) === null || _e === void 0 ? void 0 : _e.trim()) === 'Yes';
                        reason = ((_g = (_f = lines.find(function (line) { return line.startsWith('REASON:'); })) === null || _f === void 0 ? void 0 : _f.split(':')[1]) === null || _g === void 0 ? void 0 : _g.trim()) || 'No reason provided';
                        confidence = parseFloat(((_j = (_h = lines.find(function (line) { return line.startsWith('CONFIDENCE:'); })) === null || _h === void 0 ? void 0 : _h.split(':')[1]) === null || _j === void 0 ? void 0 : _j.trim()) || '0');
                        return [2 /*return*/, { approved: approved, reason: reason, confidence: confidence }];
                    case 3:
                        error_1 = _m.sent();
                        console.error('Error:', error_1);
                        return [2 /*return*/, {
                                approved: false,
                                reason: 'Service error',
                                confidence: 0
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CommentChecker;
}());
// Next.js route handler
function createNextRouteHandler(apiKey, model) {
    var checker = new CommentChecker(apiKey, model);
    return function handler(req) {
        return __awaiter(this, void 0, void 0, function () {
            var body, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (req.method !== 'POST') {
                            return [2 /*return*/, new Response('Method not allowed', { status: 405 })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, req.json()];
                    case 2:
                        body = _a.sent();
                        return [4 /*yield*/, checker.checkComment(body)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, new Response(JSON.stringify(result), {
                                headers: { 'Content-Type': 'application/json' }
                            })];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error:', error_2);
                        return [2 /*return*/, new Response(JSON.stringify({
                                approved: false,
                                reason: 'Service error',
                                confidence: 0
                            }), {
                                status: 500,
                                headers: { 'Content-Type': 'application/json' }
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
}
// Express middleware
function createExpressMiddleware(apiKey, model) {
    var checker = new CommentChecker(apiKey, model);
    return function middleware(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, checker.checkComment(req.body)];
                    case 1:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error:', error_3);
                        res.status(500).json({
                            approved: false,
                            reason: 'Service error',
                            confidence: 0
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
}

exports.CommentChecker = CommentChecker;
exports.createExpressMiddleware = createExpressMiddleware;
exports.createNextRouteHandler = createNextRouteHandler;
exports.useCommentCheck = useCommentCheck;
//# sourceMappingURL=index.js.map
