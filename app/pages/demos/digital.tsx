/**
 * Serbian Digital Transformation Visualization
 * Tech adoption, internet usage, e-commerce, and digital skills evolution
 */

import { useRouter } from 'next/router';

import { Alert, Box, Card, CardContent, Grid, Paper, Typography } from '@mui/material';

import { BarChart } from '@/components/demos/charts/BarChart';
import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { LineChart } from '@/components/demos/charts/LineChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import {
  digitalDivide,
  digitalSkillsTrends,
  eCommerceTrends,
  eGovernmentTrends,
  freelancersTrends,
  internetAdoption,
  socialMediaUsage,
  techIndustryGrowth
} from '@/data/serbia-digital';

export default function DigitalDemo() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  // Calculate statistics
  const latestInternet = internetAdoption[internetAdoption.length - 1];
  const earliestInternet = internetAdoption[0];
  const internetGrowth = (latestInternet.individuals - earliestInternet.individuals).toFixed(1);

  const latestSkills = digitalSkillsTrends[digitalSkillsTrends.length - 1];
  const latestEcommerce = eCommerceTrends[eCommerceTrends.length - 1];
  const earliestEcommerce = eCommerceTrends[0];

  const latestTech = techIndustryGrowth[techIndustryGrowth.length - 1];
  const earliestTech = techIndustryGrowth[0];
  const techGrowthRate = (((latestTech.exports / earliestTech.exports) ** (1/13) - 1) * 100).toFixed(1);

  const title = locale === 'sr'
    ? '💻 Digitalna transformacija Srbije - Tehnologija i internet'
    : '💻 Digital Transformation of Serbia - Technology and Internet';

  const description = locale === 'sr'
    ? 'Analiza digitalne transformacije kroz rast internet pristupa, digitalnih veština, e-trgovine, e-uprave i IT industrije'
    : 'Analysis of digital transformation through growth of internet access, digital skills, e-commerce, e-government, and IT industry';

  return (
    <DemoLayout
      title={title}
      description={description}
      datasetInfo={{
        title: locale === 'sr'
          ? 'Statistika digitalne ekonomije Republike Srbije'
          : 'Digital Economy Statistics of the Republic of Serbia',
        organization: locale === 'sr'
          ? 'Republički zavod za statistiku, RATEL'
          : 'Statistical Office of the Republic of Serbia, RATEL',
        updatedAt: '2024'
      }}
    >
      <Box>
        {/* Digital Success Story Alert */}
        <Alert
          severity="success"
          sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
        >
          {locale === 'sr' ? (
            <>
              <strong>🚀 DIGITALNA PRIČA USPEHA:</strong> Internet koristi <strong>{latestInternet.individuals}%</strong> građana
              (porast od {internetGrowth}p.p. od 2006). IT industrija je porasla <strong>{techGrowthRate}%</strong> godišnje,
              sa izvozom od €{latestTech.exports.toLocaleString()}M. Srbija ima <strong>{latestTech.unicorns} tech unicorna</strong>.
            </>
          ) : (
            <>
              <strong>🚀 DIGITAL SUCCESS STORY:</strong> <strong>{latestInternet.individuals}%</strong> of citizens use internet
              (increase of {internetGrowth}pp since 2006). IT industry grew <strong>{techGrowthRate}%</strong> annually,
              with exports of €{latestTech.exports.toLocaleString()}M. Serbia has <strong>{latestTech.unicorns} tech unicorns</strong>.
            </>
          )}
        </Alert>

        {/* Key Digital Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'success.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Internet korisnici' : 'Internet Users'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'success.main' }}>
                  {latestInternet.individuals}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'stanovništva (2023)' : 'of population (2023)'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'primary.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Osnovne digitalne veštine' : 'Basic Digital Skills'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {latestSkills.basic}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'stanovništva (2023)' : 'of population (2023)'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'info.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'IT izvoz (2023)' : 'IT Exports (2023)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  €{(latestTech.exports / 1000).toFixed(1)}B
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? `+${techGrowthRate}% godišnje` : `+${techGrowthRate}% annually`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'warning.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Onlajn kupovina' : 'Online Shopping'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {latestEcommerce.onlineShopping}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? `€${latestEcommerce.averageSpending} prosek/godišnje` : `€${latestEcommerce.averageSpending} avg/year`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Internet Adoption Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Rast internet pristupa (2006-2023)'
              : 'Internet Access Growth (2006-2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Eksponencijalni rast pristupa internetu. Mobilni internet je preuzeo dominaciju nakon 2015. godine. COVID-19 je dodatno ubrzao digitalizaciju.'
              : 'Exponential growth in internet access. Mobile internet took over after 2015. COVID-19 further accelerated digitalization.'
            }
          </Typography>
          <Box sx={{ height: 500 }}>
            <LineChart
              data={internetAdoption.map(d => ({
                year: d.year.toString(),
                'Individuals': d.individuals,
                'Households': d.households,
                'Mobile': d.mobile,
                'Broadband': d.broadband,
              }))}
              xKey="year"
              yKey="value"
              width={950}
              height={500}
              multiSeries={true}
            />
          </Box>
        </Paper>

        {/* Digital Skills Evolution */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Razvoj digitalnih veština (2012-2023)'
              : 'Digital Skills Development (2012-2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Procenat ljudi koji nikada nisu koristili računar opada sa 36% (2012) na samo 6% (2023). Programerske veštine rastu najbrže.'
              : 'Percentage of people who never used computer declining from 36% (2012) to only 6% (2023). Programming skills growing fastest.'
            }
          </Typography>
          <Box sx={{ height: 500 }}>
            <LineChart
              data={digitalSkillsTrends.map(d => ({
                year: d.year.toString(),
                'Basic Skills': d.basic,
                'Advanced Skills': d.advanced,
                'Programming': d.programming,
                'Never Used': d.neverUsed,
              }))}
              xKey="year"
              yKey="value"
              width={950}
              height={500}
              multiSeries={true}
            />
          </Box>
        </Paper>

        {/* E-Commerce Boom */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Rast e-trgovine i mobilnih plaćanja (2010-2023)'
              : 'E-Commerce and Mobile Payments Growth (2010-2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Onlajn kupovina je porasla sa 8.5% (2010) na 79.5% (2023). Prosečna godišnja potrošnja dostigla €1,085. Mobilna plaćanja eksplodirala od 2020.'
              : 'Online shopping grew from 8.5% (2010) to 79.5% (2023). Average annual spending reached €1,085. Mobile payments exploded since 2020.'
            }
          </Typography>
          <Box sx={{ height: 450 }}>
            <LineChart
              data={eCommerceTrends.map(d => ({
                year: d.year.toString(),
                'Online Shopping %': d.onlineShopping,
                'Mobile Payments %': d.mobilePayments,
              }))}
              xKey="year"
              yKey="value"
              width={950}
              height={450}
              multiSeries={true}
            />
          </Box>
        </Paper>

        {/* E-Government Adoption */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'E-uprava i digitalni identitet (2012-2023)'
              : 'E-Government and Digital ID (2012-2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Korišćenje e-uprave poraslo 6x od 2012. Preko 77% građana koristi digitalne javne usluge. Digitalni identitet ima 66.5% stanovništva.'
              : 'E-government use grew 6x since 2012. Over 77% citizens use digital public services. Digital ID held by 66.5% of population.'
            }
          </Typography>
          <Box sx={{ height: 450 }}>
            <LineChart
              data={eGovernmentTrends.map(d => ({
                year: d.year.toString(),
                'E-Gov Users %': d.eGovernmentUsers,
                'Online Tax Filing %': d.onlineTaxFiling,
                'Digital ID %': d.digitalID,
              }))}
              xKey="year"
              yKey="value"
              width={950}
              height={450}
              multiSeries={true}
            />
          </Box>
        </Paper>

        {/* Tech Industry Success */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'IT industrija - priča o uspehu (2010-2023)'
              : 'IT Industry - Success Story (2010-2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'IT izvoz porastao 17x od 2010. Broj zaposlenih u IT sektoru porastao 8.5x. Srbija ima 5 tech unicorna (kompanije vredne $1B+).'
              : 'IT exports grew 17x since 2010. IT sector employees increased 8.5x. Serbia has 5 tech unicorns (companies valued $1B+).'
            }
          </Typography>
          <Box sx={{ height: 450 }}>
            <ColumnChart
              data={techIndustryGrowth.map(d => ({
                year: d.year.toString(),
                'Exports (€M)': d.exports,
              }))}
              xKey="year"
              yKey="Exports (€M)"
              width={950}
              height={450}
            />
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {locale === 'sr' ? 'IT Zaposleni' : 'IT Employees'}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {latestTech.employees}K
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +{((latestTech.employees / earliestTech.employees - 1) * 100).toFixed(0)}% {locale === 'sr' ? 'od 2010' : 'since 2010'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {locale === 'sr' ? 'Startapovi' : 'Startups'}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {latestTech.startups}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +{((latestTech.startups / earliestTech.startups - 1) * 100).toFixed(0)}% {locale === 'sr' ? 'od 2010' : 'since 2010'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {locale === 'sr' ? 'Unicorns' : 'Unicorns'}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {latestTech.unicorns} 🦄
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {locale === 'sr' ? 'vrednost $1B+' : 'valued $1B+'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Social Media Usage */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {locale === 'sr'
                  ? 'Društvene mreže - penetracija (2023)'
                  : 'Social Media - Penetration (2023)'
                }
              </Typography>
              <BarChart
                data={socialMediaUsage.map(s => ({
                  platform: s.platform,
                  penetration: s.penetration
                }))}
                xKey="platform"
                yKey="penetration"
                width={450}
                height={400}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {locale === 'sr'
                  ? 'Godišnji rast korisnika po platformi'
                  : 'Annual User Growth by Platform'
                }
              </Typography>
              <ColumnChart
                data={socialMediaUsage.map(s => ({
                  platform: s.platform,
                  growth: s.growthRate
                }))}
                xKey="platform"
                yKey="growth"
                width={450}
                height={400}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {locale === 'sr'
                  ? 'TikTok najbrže raste (+25%), Twitter/X beleži pad (-8.5%).'
                  : 'TikTok growing fastest (+25%), Twitter/X declining (-8.5%).'
                }
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Digital Divide */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Digitalni jaz po demografskim grupama (2023)'
              : 'Digital Divide by Demographics (2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Pristup internetu varira značajno po starosti, obrazovanju i lokaciji. Mladi (16-24) skoro 100% pokriveni, dok stariji (75+) samo 28.5%.'
              : 'Internet access varies significantly by age, education, and location. Young (16-24) nearly 100% covered, while elderly (75+) only 28.5%.'
            }
          </Typography>
          <Box sx={{ height: 450 }}>
            <BarChart
              data={digitalDivide.map(d => ({
                demographic: d.demographic,
                access: d.access
              }))}
              xKey="demographic"
              yKey="access"
              width={950}
              height={450}
            />
          </Box>
        </Paper>

        {/* Freelancers & Remote Work */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'IT frilenseri i rad na daljinu (2015-2023)'
              : 'IT Freelancers and Remote Work (2015-2023)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Broj IT frilensersa porastao 5x od 2015. COVID-19 je dramatično povećao rad na daljinu (2020). Prosečna zarada frilenserа: €2,475/mesečno.'
              : 'IT freelancers grew 5x since 2015. COVID-19 dramatically increased remote work (2020). Average freelancer income: €2,475/month.'
            }
          </Typography>
          <Box sx={{ height: 450 }}>
            <LineChart
              data={freelancersTrends.map(d => ({
                year: d.year.toString(),
                'Freelancers (K)': d.freelancers,
                'Remote Workers (K)': d.remoteWorkers,
              }))}
              xKey="year"
              yKey="value"
              width={950}
              height={450}
              multiSeries={true}
            />
          </Box>
        </Paper>

        {/* Digital Transformation Impact */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Uticaj digitalne transformacije'
              : 'Digital Transformation Impact'
            }
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === 'sr' ? '✅ Postignuća' : '✅ Achievements'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'IT izvoz' : 'IT exports'} color="success" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `€${(latestTech.exports / 1000).toFixed(1)}B izvoz, ${techGrowthRate}% godišnji rast`
                    : `€${(latestTech.exports / 1000).toFixed(1)}B exports, ${techGrowthRate}% annual growth`
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Internet penetracija' : 'Internet penetration'} color="success" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `${latestInternet.individuals}% stanovništva online`
                    : `${latestInternet.individuals}% of population online`
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Digitalne veštine' : 'Digital skills'} color="success" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `${latestSkills.basic}% sa osnovnim veštinama`
                    : `${latestSkills.basic}% with basic skills`
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="warning.main" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === 'sr' ? '⚠️ Izazovi' : '⚠️ Challenges'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Digitalni jaz' : 'Digital divide'} color="warning" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? 'Veliki jaz između mladih (99%) i starih (28.5%)'
                    : 'Large gap between young (99%) and elderly (28.5%)'
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Grad vs. selo' : 'Urban vs. rural'} color="warning" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? 'Grad 94.8% vs. selo 82.3% pristup internetu'
                    : 'Urban 94.8% vs. rural 82.3% internet access'
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Napredne veštine' : 'Advanced skills'} color="info" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `Samo ${latestSkills.advanced}% ima napredne digitalne veštine`
                    : `Only ${latestSkills.advanced}% have advanced digital skills`
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DemoLayout>
  );
}
