interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'OnTrack - Habit Tracker',
    description: `Build lasting habits effortlessly! Track anything and everything with total customization. The simplest way to stay consistent and reach your goals.`,
    imgSrc: '/static/images/ontrack_feature_graphic.png',
    href: 'https://github.com/aymec/habit-tracker',
  },
  {
    title: 'Car Access System Patents',
    description: `A series of patents related to a car access system to remotely deploy and securely use keys in smartphones.`,
    imgSrc: '/static/images/patents_aymeric.png',
    href: 'https://patents.google.com/?inventor=Aymeric+CHALOCHET',
  },
]

export default projectsData
