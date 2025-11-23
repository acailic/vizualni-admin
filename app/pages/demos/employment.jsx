/**
 * Employment Crisis Visualization
 * Alarming data about youth unemployment, brain drain, and wage gaps
 */
import { Alert, Box, Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { LineChart } from '@/components/demos/charts/LineChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import { brainDrainData, employmentStats, skillsMismatch, unemploymentTrends, wageComparison } from '@/data/serbia-employment';
export default function EmploymentDemo() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    const title = locale === 'sr'
        ? '🚨 Kriza zaposlenosti i odliv mladih'
        : '🚨 Employment Crisis and Youth Exodus';
    const description = locale === 'sr'
        ? 'Alarmantni podaci o nezaposlenosti mladih, odlivu obrazovanih kadrova i razlici u platama'
        : 'Alarming data on youth unemployment, brain drain, and wage gaps';
    return (<DemoLayout title={title} description={description} datasetInfo={{
            title: locale === 'sr'
                ? 'Statistika tržišta rada Republike Srbije'
                : 'Labor Market Statistics of the Republic of Serbia',
            organization: locale === 'sr'
                ? 'Republički zavod za statistiku i Nacionalna služba za zapošljavanje'
                : 'Statistical Office and National Employment Service',
            updatedAt: '2024'
        }}>
      <Box>
        {/* Critical Warning Banner */}
        <Alert severity="error" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}>
          {locale === 'sr' ? (<>
              <strong>⚠️ DEMOGRAFSKA KATASTROFA:</strong> Od 2015. godine, <strong>{employmentStats.totalEmigratedSince2015.toLocaleString()}</strong> ljudi
              je napustilo Srbiju. Samo 2024. godine, otišlo je <strong>{employmentStats.emigratedIn2024.toLocaleString()}</strong> osoba,
              od čega <strong>{employmentStats.highlyEducatedEmigrated2024.toLocaleString()}</strong> visokoobrazovanih.
              Nezaposlenost mladih je <strong>{employmentStats.currentYouthUnemployment}%</strong> -
              gotovo <strong>duplo viša</strong> od EU proseka.
            </>) : (<>
              <strong>⚠️ DEMOGRAPHIC CATASTROPHE:</strong> Since 2015, <strong>{employmentStats.totalEmigratedSince2015.toLocaleString()}</strong> people
              have left Serbia. In 2024 alone, <strong>{employmentStats.emigratedIn2024.toLocaleString()}</strong> left,
              including <strong>{employmentStats.highlyEducatedEmigrated2024.toLocaleString()}</strong> highly educated.
              Youth unemployment is <strong>{employmentStats.currentYouthUnemployment}%</strong> -
              almost <strong>double</strong> the EU average.
            </>)}
        </Alert>

        {/* Key Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Nezaposlenost mladih (2024)' : 'Youth unemployment (2024)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.main' }}>
                  {employmentStats.currentYouthUnemployment}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
            ? `+${employmentStats.youthUnemploymentVsEU.toFixed(1)}% vs EU prosek`
            : `+${employmentStats.youthUnemploymentVsEU.toFixed(1)}% vs EU average`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.dark' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Emigranti u 2024' : 'Emigrants in 2024'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.dark' }}>
                  {employmentStats.emigratedIn2024.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'osoba napustilo zemlju' : 'people left the country'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Razlika u platama' : 'Wage gap with EU'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  -{employmentStats.averageWageDifferenceWithEU}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'prosečno vs EU' : 'average vs EU'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'info.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Nedostaje radnika' : 'Worker shortage'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {employmentStats.totalJobsShortage.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'u deficitarnim zanimanjima' : 'in shortage occupations'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Youth Unemployment Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? '📉 Nezaposlenost mladih - Duplo viša od EU proseka'
            : '📉 Youth Unemployment - Double the EU Average'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Stopa nezaposlenosti mladih (15-24 godine) u Srbiji je alarmantno visoka uprkos izvesnom poboljšanju.'
            : 'Youth unemployment rate (15-24 years) in Serbia remains alarmingly high despite some improvement.'}
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <LineChart data={unemploymentTrends.map(item => ({
            label: item.year.toString(),
            value: item.youthUnemploymentRate,
            category: locale === 'sr' ? 'Mladi (15-24)' : 'Youth (15-24)'
        }))} title="" width={900} height={400}/>
            {/* EU average line indicator */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>{locale === 'sr' ? 'EU prosek (2024):' : 'EU average (2024):'}</strong> 14.8%
                {' '}|{' '}
                <strong>{locale === 'sr' ? 'Srbija:' : 'Serbia:'}</strong> {employmentStats.currentYouthUnemployment}%
                {' '}({locale === 'sr' ? '+' : '+'}{employmentStats.youthUnemploymentVsEU.toFixed(1)}{locale === 'sr' ? ' p.p. više' : ' p.p. higher'})
              </Typography>
            </Box>
          </Box>

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'KRITIČNO:' : 'CRITICAL:'}</strong>{' '}
            {locale === 'sr'
            ? 'Svaki četvrti mladi čovek u Srbiji je nezaposlen. To znači da mladi ljudi ne vide budućnost u svojoj zemlji i odlaze.'
            : 'Every fourth young person in Serbia is unemployed. This means young people see no future in their country and leave.'}
          </Alert>
        </Paper>

        {/* Brain Drain - Emigration Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? '🌍 Odliv mozgova - "Brain Drain" u akciji'
            : '🌍 Brain Drain in Action'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Broj osoba koje napuštaju Srbiju raste svake godine, a posebno zabrinjavajući je odliv visokoobrazovanih.'
            : 'Number of people leaving Serbia grows every year, with highly educated exodus particularly concerning.'}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {locale === 'sr' ? 'Ukupan broj emigranata' : 'Total emigrants'}
              </Typography>
              <LineChart data={brainDrainData.map(item => ({
            label: item.year.toString(),
            value: item.emigrantsTotal,
            category: locale === 'sr' ? 'Ukupno' : 'Total'
        }))} title="" width={450} height={350}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {locale === 'sr' ? 'Visokoobrazovani emigranti' : 'Highly educated emigrants'}
              </Typography>
              <LineChart data={brainDrainData.map(item => ({
            label: item.year.toString(),
            value: item.highlyEducated,
            category: locale === 'sr' ? 'Visokoobrazovani' : 'Highly educated'
        }))} title="" width={450} height={350}/>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            {locale === 'sr'
            ? `Trend je alarmantno rastući. U poslednje 3 godine (2022-2024),
                 ${(brainDrainData.slice(-3).reduce((sum, y) => sum + y.emigrantsTotal, 0)).toLocaleString()} ljudi je napustilo Srbiju -
                 što je skoro polovina ukupnog broja od 2015. godine.`
            : `The trend is alarmingly increasing. In the last 3 years (2022-2024),
                 ${(brainDrainData.slice(-3).reduce((sum, y) => sum + y.emigrantsTotal, 0)).toLocaleString()} people left Serbia -
                 nearly half the total since 2015.`}
          </Alert>
        </Paper>

        {/* Wage Comparison */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? '💰 Razlika u platama - Zašto ljudi odlaze'
            : '💰 Wage Gap - Why People Leave'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Poređenje prosečnih plata u Srbiji i EU pokazuje ogroman jaz koji je glavni razlog emigracije.'
            : 'Comparison of average salaries in Serbia and EU shows a huge gap that is the main reason for emigration.'}
          </Typography>

          <Grid container spacing={2}>
            {wageComparison.map((sector, index) => (<Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {locale === 'sr' ? sector.sector : sector.sectorEn}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          {locale === 'sr' ? 'Srbija' : 'Serbia'}
                        </Typography>
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                          €{sector.serbiaAvgMonthly}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          {locale === 'sr' ? 'EU prosek' : 'EU average'}
                        </Typography>
                        <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                          €{sector.euAvgMonthly}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'error.lighter', borderRadius: 1 }}>
                      <Typography variant="body2" color="error.dark" fontWeight={600}>
                        {locale === 'sr' ? 'Razlika:' : 'Difference:'} {sector.difference}%
                        {' '}({locale === 'sr' ? 'niža plata u Srbiji' : 'lower salary in Serbia'})
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>))}
          </Grid>

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'EKONOMSKI RAZLOG ODLASKA:' : 'ECONOMIC REASON FOR LEAVING:'}</strong>{' '}
            {locale === 'sr'
            ? `Prosečna razlika u platama je ${employmentStats.averageWageDifferenceWithEU}%.
                 Zdravstveni radnici u EU mogu da zarade 5-6 puta više, IT stručnjaci 3-4 puta više.`
            : `Average wage difference is ${employmentStats.averageWageDifferenceWithEU}%.
                 Healthcare workers in EU can earn 5-6 times more, IT professionals 3-4 times more.`}
          </Alert>
        </Paper>

        {/* Skills Mismatch */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? '🎓 Neusklađenost obrazovanja i tržišta rada'
            : '🎓 Education-Labor Market Mismatch'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Ogromna neusklađenost između broja diplomiranih i potreba tržišta rada.'
            : 'Huge mismatch between number of graduates and labor market needs.'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: 'error.lighter', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'error.dark' }}>
                    {locale === 'sr' ? '❌ Prekomerni kapaciteti (Previše diplomiranih)' : '❌ Surplus (Too many graduates)'}
                  </Typography>
                  {skillsMismatch
            .filter(s => s.mismatch === 'surplus')
            .map((skill, index) => (<Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {locale === 'sr' ? skill.field : skill.fieldEn}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'Diplomiranih:' : 'Graduates:'} {skill.graduates.toLocaleString()} |{' '}
                          {locale === 'sr' ? 'Poslova:' : 'Jobs:'} {skill.jobOpenings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="error.dark" fontWeight={600}>
                          {locale === 'sr' ? 'Višak:' : 'Surplus:'} +{(skill.graduates - skill.jobOpenings).toLocaleString()}
                        </Typography>
                      </Box>))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: 'warning.lighter', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'warning.dark' }}>
                    {locale === 'sr' ? '⚠️ Nedostajući kadrovi (Premalo stručnjaka)' : '⚠️ Shortage (Too few professionals)'}
                  </Typography>
                  {skillsMismatch
            .filter(s => s.mismatch === 'shortage')
            .map((skill, index) => (<Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {locale === 'sr' ? skill.field : skill.fieldEn}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'Diplomiranih:' : 'Graduates:'} {skill.graduates.toLocaleString()} |{' '}
                          {locale === 'sr' ? 'Poslova:' : 'Jobs:'} {skill.jobOpenings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="warning.dark" fontWeight={600}>
                          {locale === 'sr' ? 'Manjak:' : 'Shortage:'} -{(skill.jobOpenings - skill.graduates).toLocaleString()}
                        </Typography>
                      </Box>))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            {locale === 'sr'
            ? `Obrazovni sistem ne prati potrebe tržišta rada.
                 Imamo ${employmentStats.totalGraduatesSurplus.toLocaleString()} diplomiranih bez posla,
                 dok ${employmentStats.totalJobsShortage.toLocaleString()} pozicija ostaje nepopunjeno.`
            : `Education system doesn't match labor market needs.
                 We have ${employmentStats.totalGraduatesSurplus.toLocaleString()} unemployed graduates,
                 while ${employmentStats.totalJobsShortage.toLocaleString()} positions remain unfilled.`}
          </Alert>
        </Paper>
      </Box>
    </DemoLayout>);
}
/**
 * Static generation for GitHub Pages
 */
export async function getStaticProps() {
    return {
        props: {}
    };
}
