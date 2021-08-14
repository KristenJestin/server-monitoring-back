// imports
import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import sharp from 'sharp'

// main
const resizeImage = async (
    paths: string[],
    file?: MultipartFileContract
): Promise<string | undefined> => {
    if (!file) return undefined

    const originalPath = Application.makePath(...paths, 'original')
    const path = Application.makePath(...paths)
    const fileName = cuid()
    await file.move(originalPath, {
        name: `${fileName}.${file.extname}`,
    })
    // resize image
    await sharp(`${originalPath}/${fileName}.${file.extname}`)
        .rotate()
        .jpeg({ mozjpeg: true })
        .toFile(`${path}/${fileName}.jpg`) // original to jpeg
    await sharp(`${originalPath}/${fileName}.${file.extname}`)
        .rotate()
        .resize(100, 100, { fit: 'cover' })
        .jpeg({ mozjpeg: true })
        .toFile(`${path}/${fileName}.sm.jpg`) // original to jpeg mini
    await sharp(`${originalPath}/${fileName}.${file.extname}`)
        .rotate()
        .resize(500, 500, { fit: 'cover' })
        .jpeg({ mozjpeg: true })
        .toFile(`${path}/${fileName}.md.jpg`) // original to jpeg mediium

    return fileName
}

// exports
export { resizeImage }
