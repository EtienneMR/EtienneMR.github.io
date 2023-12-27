const USERNAME = "EtienneMR"
const LANGS_TO_ICON = {
    javascript: "js",
    java: "jar",
}
const FORK_IMAGE = "https://raw.githubusercontent.com/microsoft/vscode-icons/main/icons/dark/repo-forked.svg"
const ARCHIVE_IMAGE = "https://raw.githubusercontent.com/microsoft/vscode-icons/main/icons/dark/archive.svg"

const reposList = document.getElementById("repos-list")
const profilePicture = document.getElementById("profile-picture")

async function fetchPublicRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?type=all&sort=updated`)

        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status} - ${response.statusText}`)
        }

        const repositories = await response.json()

        return repositories
    } catch (error) {
        console.error('Error fetching repositories:', error.message)
        throw error
    }
}

function langToImage(lang) {
    lang = lang.toLowerCase()
    if (LANGS_TO_ICON[lang]) lang = LANGS_TO_ICON[lang]

    return `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_${lang}.svg`
}

class ProjectCard {
    constructor(repo) {
        this.repo = repo

        const card = this.card = document.createElement("div")
        card.className = "card"

        const langsElement = this.langs = document.createElement("div")
        langsElement.className = "card__langs"
        card.appendChild(langsElement)

        const cardContent = this.content = document.createElement("div")
        cardContent.className = "card__content"
        card.appendChild(cardContent)

        const titleElement = document.createElement("p")
        titleElement.className = "card__title"
        cardContent.appendChild(titleElement)

        const titleAnchor = this.title = document.createElement("a")
        titleAnchor.target = "_blank"
        titleElement.append(titleAnchor)

        const subtitleElement = this.subtitle = document.createElement("p")
        subtitleElement.className = "card__subtitle"
        cardContent.appendChild(subtitleElement)

        const descriptionElement = this.description = document.createElement("p")
        descriptionElement.className = "card__description"
        cardContent.appendChild(descriptionElement)

        const linksElement = this.links = document.createElement("p")
        linksElement.className = "card__links"
        cardContent.appendChild(linksElement)

        reposList.appendChild(card)

        this.image = null

        this.setTitle(repo.name)
        this.setDescription(repo.description)
        this.addLink("Github", repo.html_url)

        if (repo.homepage) {
            this.addLink("Afficher", repo.homepage)
        }
        else if (repo.has_pages) {
            this.addLink("Afficher", `/${repo.name}`)
        }

        this.fetch()
    }

    setTitle(title) {
        this.title.textContent = title
    }

    addLink(label, href) {
        this.title.href = href

        const linkElement = document.createElement("a")
        linkElement.textContent = label
        linkElement.href = href
        linkElement.target = "_blank"
        this.links.insertBefore(linkElement, this.links.firstChild)
    }

    setDescription(description) {
        this.description.textContent = description
    }

    setSubtitle(subtitle) {
        this.subtitle.textContent = subtitle
    }

    setImage(src) {
        if (this.image) this.image.remove()

        if (src) {
            const img = this.image = document.createElement("img")
            img.src = src
            img.alt = `Icone de ${this.repo.name}`
            img.classList.add("card__img")
            this.card.insertBefore(img, this.content)
        }
        else {
            const svg = this.image = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            svg.setAttribute("viewBox", "0 0 24 24")
            svg.classList.add("card__img", "no-icon")
            this.card.insertBefore(svg, this.content)

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
            path.setAttribute("d", "M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z")
            svg.appendChild(path)
        }
    }

    setLanguages(languages) {
        while (true) {
            const next = this.langs.firstChild
            if (next) next.remove()
            else break
        }

        let last = 0

        for (let lang in languages) {
            let value = languages[lang]

            if (value < last * 0.5) break
            if (value > last) last = value

            const icon = document.createElement("img")
            icon.width = icon.height = "24"
            icon.alt = `Utilise ${lang}`
            icon.src = langToImage(lang)
            this.langs.appendChild(icon)
        }

        if (this.repo.archived) {
            const icon = document.createElement("img")
            icon.width = icon.height = "24"
            icon.alt = "Projet archivé"
            icon.src = ARCHIVE_IMAGE
            this.langs.appendChild(icon)
        }
        else if (this.repo.fork) {
            const icon = document.createElement("img")
            icon.width = icon.height = "24"
            icon.alt = "Porjet issu d'un fork"
            icon.src = FORK_IMAGE
            this.langs.appendChild(icon)
        }
    }

    async fetch() {
        const cahedData = sessionStorage.getItem(`project:${this.repo.full_name}`)

        const data = {
            image: null,
            subtitle: null,
            langs: null,

            ...(cahedData ? JSON.parse(cahedData) : {}),
        }
        try {
            if (!data.langs || !data.subtitle || !data.image) {
                const langs_response = await fetch(`https://api.github.com/repos/${this.repo.full_name}/languages`)

                if (!langs_response.ok) {
                    throw new Error(`GitHub API request failed: ${langs_response.status} - ${langs_response.statusText}`)
                }

                const langs = data.langs = await langs_response.json()
                const langs_list = Object.keys(langs)

                if (!data.image || !data.subtitle) {
                    let indexUrl = this.repo.homepage

                    if (!indexUrl && langs_list.includes("HTML")) {
                        const files_response = await fetch(`https://api.github.com/repos/${this.repo.full_name}/contents`)

                        if (!files_response.ok) {
                            throw new Error(`GitHub API request failed: ${files_response.status} - ${files_response.statusText}`)
                        }

                        const files = await files_response.json()

                        const index_html = files.find(file => file.name == "index.html")

                        indexUrl = index_html.download_url
                    }

                    if (indexUrl) {
                        try {
                            const url = new URL(indexUrl)
                            if (url.protocol == "http:") url.protocol = "https:"

                            const index_response = await fetch(url.href)

                            if (!index_response.ok) {
                                throw new Error(`GitHub API request failed: ${index_response.status} - ${index_response.statusText}`)
                            }

                            const indexContents = await index_response.text()

                            const parser = new DOMParser()
                            const doc = parser.parseFromString(indexContents, 'text/html')

                            const title = doc.querySelector('title')

                            let faviconHref = null
                            let minDiff = Infinity

                            for (let link of doc.querySelectorAll("link")) {
                                if (link.rel.endsWith("icon")) {
                                    const sizes = link.sizes

                                    console.log(sizes)

                                    if (sizes.contains("any")) {
                                        faviconHref = link.href
                                        break
                                    }
                                    else if (sizes.length > 0) {
                                        for (let size of sizes) {
                                            const [x, y] = size.includes("x") ? size.split("x") : size.split("X")

                                            const diff = Math.abs(100 - Number(x)) + Math.abs(100 - Number(y))
                                            if (diff < minDiff) {
                                                minDiff = diff
                                                faviconHref = link.href
                                            }
                                            if (diff == 0) break
                                        }
                                    }
                                    else {
                                        faviconHref = link.href
                                    }
                                }
                            }

                            if (faviconHref && !faviconHref.includes("://")) {
                                faviconHref = `/${this.repo.name}/${faviconHref}`
                            }

                            data.image = new URL(faviconHref, this.repo.homepage ?? location.href).href
                            data.subtitle = title ? title.textContent : null
                        } catch (error) {
                            console.info(`Failled to fetch index page of ${this.repo.name} at ${indexUrl} because ${error}. Using default image and subtitle`)
                        }
                    }
                }

                if (!data.image && langs_list.length > 0) {
                    data.image = langToImage(langs_list[0])
                }

                const stringified = JSON.stringify(data)
                sessionStorage.setItem(`project:${this.repo.full_name}`, stringified)
            }
        } catch (error) {
            console.error(error)
        }

        this.setImage(data.image)
        this.setSubtitle(data.subtitle ?? this.repo.full_name)
        this.setLanguages(data.langs ?? [])

    }
}

(async () => {
    const repos = await fetchPublicRepositories()
    repos.forEach(async (repo) => {
        new ProjectCard(repo)
    })
})()
