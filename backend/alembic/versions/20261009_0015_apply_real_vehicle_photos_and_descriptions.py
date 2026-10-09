"""Apply supplied real vehicle photos and descriptions.

Revision ID: 20261009_0015
Revises: 20261001_0014
Create Date: 2026-10-09
"""
import json
from alembic import op
import sqlalchemy as sa

revision = "20261009_0015"
down_revision = "20261001_0014"
branch_labels = None
depends_on = None

DATA = {'2018-porsche-718-cayman-gts': {'description': 'Turbocharged 2.5L flat-four paired with a seven-speed '
                                                'dual-clutch transaxle. Finished in Agate Gray Metallic over '
                                                'black leather and Race-Tex, with 20-inch Carrera Classic II '
                                                'wheels, PASM sport suspension, heated Adaptive Sport Seats '
                                                'Plus, and carbon-fiber interior trim.',
                                 'images': ['/media/vehicles/2018-porsche-718-cayman-gts/001.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/002.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/003.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/004.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/005.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/006.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/007.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/008.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/009.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/010.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/011.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/012.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/013.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/014.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/015.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/017.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/018.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/019.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/020.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/021.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/022.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/023.webp',
                                            '/media/vehicles/2018-porsche-718-cayman-gts/024.webp']},
 '2018-toyota-land-cruiser-urj200': {'description': '5.7L V8 paired with an eight-speed automatic '
                                                    'transmission, dual-range transfer case, and Torsen '
                                                    'locking center differential. Finished in Midnight Black '
                                                    'Metallic over black leather, with 18-inch alloy wheels, '
                                                    'KDSS, a sunroof, heated and ventilated front seats, '
                                                    'navigation, and four-zone climate control.',
                                     'images': ['/media/vehicles/2018-toyota-land-cruiser-urj200/001.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/002.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/003.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/004.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/005.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/006.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/007.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/008.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/009.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/010.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/011.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/012.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/013.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/014.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/015.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/016.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/017.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/018.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/019.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/020.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/021.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/022.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/023.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/024.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/025.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/026.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/027.webp',
                                                '/media/vehicles/2018-toyota-land-cruiser-urj200/028.webp']},
 '2020-cadillac-escalade-esv-platinum-4wd': {'description': '6.2L V8 paired with a 10-speed automatic '
                                                            'transmission. Finished in Crystal White Tricoat '
                                                            'over Maple Sugar Nappa leather, with 22-inch '
                                                            'Vogue Tyre wheels, a sunroof, power-retractable '
                                                            'running boards, heated and cooled front seats, '
                                                            'rear-seat entertainment, and Bose audio.',
                                             'images': ['/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/001.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/002.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/003.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/004.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/005.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/006.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/007.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/008.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/009.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/010.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/011.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/012.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/013.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/014.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/015.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/016.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/017.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/018.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/019.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/020.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/021.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/022.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/023.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/024.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/025.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/026.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/027.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/028.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/029.webp',
                                                        '/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/030.webp']},
 '2021-ford-f-150-shelby-raptor-baja-supercrew': {'description': 'Twin-turbocharged 3.5L V6 with revised '
                                                                 'Whipple tuning, paired with a 10-speed '
                                                                 'automatic transmission and dual-range '
                                                                 'transfer case. Finished in Lead Foot over '
                                                                 'black and red upholstery, with Shelby '
                                                                 '18-inch wheels, Fox-shock lifted '
                                                                 'suspension, a chase rack, heated and '
                                                                 'ventilated front seats, and Bang & Olufsen '
                                                                 'audio.',
                                                  'images': ['/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/001.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/002.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/003.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/004.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/005.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/006.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/007.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/008.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/009.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/010.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/011.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/012.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/013.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/014.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/015.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/016.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/017.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/018.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/019.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/020.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/021.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/022.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/023.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/024.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/025.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/026.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/027.webp',
                                                             '/media/vehicles/2021-ford-f-150-shelby-raptor-baja-supercrew/028.webp']},
 '2022-bmw-m5-competition-package': {'description': 'Twin-turbocharged 4.4L V8 paired with an eight-speed '
                                                    'automatic transmission and Active M differential. '
                                                    'Finished in Motegi Red Metallic over Silverstone Merino '
                                                    'leather, with 20-inch Style 706M wheels, a carbon-fiber '
                                                    'roof, massaging front seats, a surround-view camera, '
                                                    'and Bowers & Wilkins audio.',
                                     'images': ['/media/vehicles/2022-bmw-m5-competition-package/001.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/002.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/003.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/004.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/005.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/006.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/007.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/008.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/009.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/010.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/011.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/012.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/013.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/014.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/015.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/016.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/017.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/018.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/019.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/020.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/021.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/022.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/023.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/024.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/025.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/026.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/027.webp',
                                                '/media/vehicles/2022-bmw-m5-competition-package/028.webp']},
 '2022-cadillac-ct5-v-blackwing-6-speed': {'description': 'Supercharged 6.2L V8 paired with a six-speed '
                                                          'manual transmission and electronic limited-slip '
                                                          'differential. Finished in Rift Metallic over Jet '
                                                          'Black leather, with polished 19-inch wheels, red '
                                                          'Brembo calipers, Magnetic Ride Control, heated '
                                                          'and ventilated front seats, and an AKG sound '
                                                          'system.',
                                           'images': ['/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/001.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/002.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/003.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/004.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/005.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/006.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/007.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/008.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/009.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/010.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/011.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/012.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/013.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/014.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/015.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/016.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/017.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/018.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/019.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/020.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/021.webp',
                                                      '/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/022.webp']},
 '2022-tesla-model-s-plaid': {'description': 'Three AC induction motors deliver all-wheel drive. Finished in '
                                             'Red Multi-Coat over cream synthetic leather, with 19-inch '
                                             'Tempest wheels, a panoramic roof, Full Self-Driving '
                                             'Capability, heated and ventilated front seats, a 17-inch '
                                             'touchscreen, and 22-speaker audio.',
                              'images': ['/media/vehicles/2022-tesla-model-s-plaid/001.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/002.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/003.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/004.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/005.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/006.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/007.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/008.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/009.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/010.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/011.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/012.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/013.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/014.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/015.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/016.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/017.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/018.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/019.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/020.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/021.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/022.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/023.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/024.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/025.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/026.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/027.webp',
                                         '/media/vehicles/2022-tesla-model-s-plaid/028.webp']},
 '2023-bmw-x6-m50i': {'description': '4.4L TwinPower Turbo V8 paired with an eight-speed automatic '
                                     'transmission. Finished in Black Sapphire Metallic over Ivory White '
                                     'leather, with 22-inch M double-spoke wheels, adaptive LED headlights, '
                                     'a panoramic sunroof, heated and ventilated front seats, a head-up '
                                     'display, and surround-view cameras.',
                      'images': ['/media/vehicles/2023-bmw-x6-m50i/001.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/002.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/003.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/004.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/005.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/006.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/007.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/008.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/009.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/010.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/011.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/012.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/013.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/014.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/015.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/016.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/017.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/018.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/019.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/020.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/021.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/022.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/023.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/024.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/025.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/026.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/027.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/028.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/029.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/030.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/031.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/032.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/033.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/034.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/035.webp',
                                 '/media/vehicles/2023-bmw-x6-m50i/036.webp']},
 '2023-cadillac-escalade-v-esv': {'description': 'Supercharged 6.2L V8 paired with a 10-speed automatic '
                                                 'transmission and all-wheel drive. Finished in Black Raven '
                                                 'over Jet Black semi-aniline leather, with 22-inch alloy '
                                                 'wheels, Super Cruise, heated and ventilated front seats, '
                                                 'heated second-row seats, a head-up display, and an AKG '
                                                 'audio system.',
                                  'images': ['/media/vehicles/2023-cadillac-escalade-v-esv/001.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/002.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/003.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/004.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/005.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/006.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/007.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/008.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/009.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/010.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/011.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/012.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/013.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/014.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/015.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/016.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/017.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/018.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/019.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/020.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/021.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/022.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/023.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/024.webp',
                                             '/media/vehicles/2023-cadillac-escalade-v-esv/025.webp']},
 '2023-porsche-cayenne-platinum-edition': {'description': 'Turbocharged 3.0L V6 paired with an eight-speed '
                                                          'automatic transmission and all-wheel drive. '
                                                          'Finished in white over Bordeaux Red leather, with '
                                                          '22-inch 911 Turbo Design wheels, a panoramic '
                                                          'sunroof, heated and ventilated front seats, a '
                                                          'surround-view camera, and LED headlights with '
                                                          'PDLS.',
                                           'images': ['/media/vehicles/2023-porsche-cayenne-platinum-edition/001.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/002.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/003.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/004.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/005.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/006.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/007.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/008.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/009.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/010.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/011.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/012.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/013.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/014.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/015.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/016.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/017.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/018.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/019.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/020.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/021.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/022.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/023.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/024.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/025.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/026.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/027.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/028.webp',
                                                      '/media/vehicles/2023-porsche-cayenne-platinum-edition/029.webp']},
 '2024-chevrolet-corvette-stingray-convertible-z51-2lt': {'description': '6.2L LT2 V8 paired with an '
                                                                         'eight-speed dual-clutch transaxle '
                                                                         'and limited-slip differential. '
                                                                         'Finished in Carbon Flash Metallic '
                                                                         'over Sky Cool Gray and Jet Black '
                                                                         'leather, with the Z51 Performance '
                                                                         'Package, 19- and 20-inch wheels, a '
                                                                         'retractable hardtop, heated and '
                                                                         'ventilated GT2 seats, and a Bose '
                                                                         'sound system.',
                                                          'images': ['/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/001.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/002.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/003.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/004.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/005.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/006.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/007.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/008.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/009.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/010.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/011.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/012.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/013.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/014.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/015.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/016.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/017.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/018.webp',
                                                                     '/media/vehicles/2024-chevrolet-corvette-stingray-convertible-z51-2lt/019.webp']},
 '2024-ford-f-250-super-duty-black-widow': {'description': '6.7L High Output Power Stroke turbodiesel V8 '
                                                           'paired with a 10-speed automatic transmission, '
                                                           'dual-range transfer case, and electronically '
                                                           'locking rear axle. Finished in Carbonized Gray '
                                                           'over Black Onyx leather, with the Black Widow '
                                                           'package, 22-inch wheels, a panoramic sunroof, '
                                                           'and heated and ventilated front seats.',
                                            'images': ['/media/vehicles/2024-ford-f-250-super-duty-black-widow/001.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/002.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/003.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/004.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/005.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/006.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/007.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/008.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/009.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/010.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/011.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/012.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/013.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/014.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/015.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/016.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/017.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/018.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/019.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/020.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/021.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/022.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/023.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/024.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/025.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/026.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/027.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/028.webp',
                                                       '/media/vehicles/2024-ford-f-250-super-duty-black-widow/029.webp']},
 '2024-mercedes-amg-g63': {'description': 'Twin-turbocharged 4.0L V8 paired with a nine-speed automatic '
                                          'transmission, dual-range transfer case, and three locking '
                                          'differentials. Finished in black over Bengal Red Nappa leather, '
                                          'with 21-inch AMG wheels, a sunroof, heated and ventilated front '
                                          'seats, Distronic adaptive cruise control, MBUX navigation, and '
                                          'Burmester audio.',
                           'images': ['/media/vehicles/2024-mercedes-amg-g63/001.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/002.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/003.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/004.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/005.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/006.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/007.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/008.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/009.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/010.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/011.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/012.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/013.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/014.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/015.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/016.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/018.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/019.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/020.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/021.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/022.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/023.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/024.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/025.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/026.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/027.webp',
                                      '/media/vehicles/2024-mercedes-amg-g63/028.webp']},
 '2024-toyota-4runner-trd-off-road-premium-4x4': {'description': '4.0L V6 paired with a five-speed automatic '
                                                                 'transmission, part-time four-wheel drive, '
                                                                 'and locking rear differential. Finished in '
                                                                 'Underground over black SofTex, with '
                                                                 '17-inch matte-black wheels, KDSS, Bilstein '
                                                                 'dampers, rock sliders, heated front seats, '
                                                                 'and a sunroof.',
                                                  'images': ['/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/001.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/002.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/003.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/004.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/005.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/006.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/007.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/008.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/009.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/010.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/011.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/012.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/013.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/014.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/015.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/016.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/017.webp',
                                                             '/media/vehicles/2024-toyota-4runner-trd-off-road-premium-4x4/018.webp']},
 '2025-gmc-sierra-1500-pro-4x4': {'description': 'Turbocharged 2.7L inline-four paired with an eight-speed '
                                                 'automatic transmission and AutoTrac transfer case. '
                                                 'Finished in Onyx Black over Jet Black upholstery, with '
                                                 'black 24-inch wheels, lowered suspension, color-matched '
                                                 'trim, an aftermarket exhaust, a tonneau cover, and LED '
                                                 'exterior lights.',
                                  'images': ['/media/vehicles/2025-gmc-sierra-1500-pro-4x4/001.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/002.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/003.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/004.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/005.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/006.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/007.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/008.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/009.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/010.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/011.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/012.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/013.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/014.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/015.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/016.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/017.webp',
                                             '/media/vehicles/2025-gmc-sierra-1500-pro-4x4/018.webp']}}

def upgrade():
    bind = op.get_bind()
    vehicles = sa.table(
        "vehicles", sa.column("slug", sa.String), sa.column("images", sa.JSON),
        sa.column("description", sa.Text), sa.column("short_description", sa.String),
        sa.column("details", sa.JSON),
    )
    for slug, item in DATA.items():
        paragraphs = [part.strip() for part in item["description"].split("\n\n") if part.strip()]
        current = bind.execute(sa.select(vehicles.c.details).where(vehicles.c.slug == slug)).scalar_one_or_none()
        details = dict(current or {})
        details["raw_description"] = item["description"]
        bind.execute(vehicles.update().where(vehicles.c.slug == slug).values(
            images=item["images"], description=item["description"],
            short_description=paragraphs[0] if paragraphs else item["description"], details=details,
        ))

def downgrade():
    raise RuntimeError("This migration replaces supplied listing media and descriptions and has no automatic downgrade.")
