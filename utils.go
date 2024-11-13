package main

import (
	"bytes"
	"os/user"
	"runtime"

	"github.com/microcosm-cc/bluemonday"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

func (a *App) GetPC() interface{} {
	user, err := user.Current()
	username := user.Username
	platform := runtime.GOOS

	if err != nil {
		username = "Anonymous user"
	}

	return map[string]string{
		"user":   username,
		"system": platform,
	}
}

func markdownConverter(text string) (string, error) {
	var buf bytes.Buffer

	policy := bluemonday.StrictPolicy()
	cleanBody := policy.Sanitize(text)

	md := goldmark.New(
		goldmark.WithExtensions(
			extension.Typographer,
			extension.DefinitionList,
			extension.Footnote,
			extension.Strikethrough,
			extension.GFM,
			extension.TaskList,
			extension.Linkify,
			extension.Table,
			highlighting.NewHighlighting(
				highlighting.WithStyle("monokai"),
				highlighting.WithFormatOptions(),
			)),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
		),
	)

	if err := md.Convert([]byte(cleanBody), &buf); err != nil {
		return "", err
	}
	return buf.String(), nil
}
