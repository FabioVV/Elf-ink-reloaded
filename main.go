package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:             "Elf-Ink",
		Width:             800,
		Height:            600,
		Frameless:         false,
		MinWidth:          740,
		MinHeight:         480,
		HideWindowOnClose: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},

		// BackgroundColour: &options.RGBA{R: 20, G: 22, B: 39, A: 1},

		OnStartup: app.startup,
		// OnShutdown: app.Shutdown,

		Windows: &windows.Options{WindowIsTranslucent: true, WebviewIsTransparent: true},
		Mac:     &mac.Options{WindowIsTranslucent: true, WebviewIsTransparent: true},
		Linux:   &linux.Options{WindowIsTranslucent: true, ProgramName: "Elf-Ink R"},

		Bind: []interface{}{
			app,
		},

		LogLevel:           logger.DEBUG,
		LogLevelProduction: logger.ERROR,
		ErrorFormatter:     func(err error) any { return err.Error() },
	})

	if err != nil {
		println("Error:", err.Error())

	}
}
