import { GetStaticPropsResult } from 'next'
import { getSingleStats, SingleStats } from '../processing/stats'

export default function Home({ stats }: { stats: SingleStats }) {
  console.log(stats)

  return (
    <div style={{ margin: '2rem' }}>
      <p>
        <strong>Total Active cases as % of NZ population:</strong>{' '}
        {stats['Active cases as percentage of population'].toFixed(2) + '%'}
      </p>

      <p>
        Oh and be sure to check out the{' '}
        <strong>
          <a href="/glossary">glossary</a>
        </strong>
      </p>
    </div>
  )
}

export function getStaticProps(): GetStaticPropsResult<{ stats: SingleStats }> {
  console.log('bong', getSingleStats)
  return {
    props: {
      stats: getSingleStats(),
    },
  }
}
