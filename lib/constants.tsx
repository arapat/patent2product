import React from 'react';

export const APP_NAME = "patent2product";

export const MOCK_PATENTS = [
    {
        id: "p1",
        page_url: "https://patents.google.com/patent/US10362384B2/",
        title: "Earphone cover",
        pdf_url: "https://patentimages.storage.googleapis.com/df/18/78/94a867d3557b7c/US10362384.pdf",
        abstract: "An earphone cover for an earphone includes an ear bud skin and an extension. The earphone includes an ear bud with a stem, and the earphone is inserted into a user's ear canal. The stem extends from the ear bud and a primary speaker outlet is formed on the ear bud. The ear bud skin substantially covers the ear bud of the earphone and increases friction between the ear bud and user's ear (provides an interface that increases friction between the ear bud and the user's ear) and the extension extends from the ear bud skin for more secure fit of the earphone to user's ear. The earphone cover is sufficiently flexible and elastic to accept insertion of the earphone therein along with being made of a material to provide a comfortable fit too.",
        images: [
            {
                url: "https://patentimages.storage.googleapis.com/c0/f3/ed/9bab6e0719cfc5/US10362384-20190723-D00008.png",
                local_path: "/assets/patents/p1/image_1.png"
            },
            {
                url: "https://patentimages.storage.googleapis.com/15/7e/31/1a5dfbed39b4e1/US10362384-20190723-D00009.png",
                local_path: "/assets/patents/p1/image_2.png"
            },
            {
                url: "https://patentimages.storage.googleapis.com/8c/3c/81/8fac688b054434/US10362384-20190723-D00000.png",
                local_path: "/assets/patents/p1/image_3.png"
            },
            {
                url: "https://patentimages.storage.googleapis.com/c5/81/65/27846ed30b73aa/US10362384-20190723-D00010.png",
                local_path: "/assets/patents/p1/image_4.png"
            }
        ],
        pdf_local_path: "/assets/patents/p1/patent.pdf",
        tags: ["Audio", "Wearable", "Accessories"]
    },
    {
        id: "p2",
        page_url: "https://patents.google.com/patent/US20120281344A1/en?oq=20120281344",
        title: "Media player with machined window undercut and transparent wall disposed therein",
        pdf_url: "https://patentimages.storage.googleapis.com/36/23/35/ce0bfbd07e400f/US20120281344A1.pdf",
        abstract: "A media player comprising a display screen is provided. The media player can include a housing having an opening and an area of reduced thickness around the opening. The media player can also include a transparent wall having a flange. Alternatively, the transparent wall may not require a flange but rather can be a flat, substantially transparent piece of material such as plexiglass or glass. The flange can be adhered to a surface of the area of reduced thickness in order to form a transparent protective cover for the display screen.",
        images: [
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_1.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_2.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_3.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_4.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_5.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_6.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_7.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_8.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_9.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_10.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_11.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_12.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_13.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_14.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_15.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_16.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_17.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_18.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_19.png"
            },
            {
                url: "",
                local_path: "/assets/US20120281344A1/pdf_images/page_20.png"
            }
        ],
        pdf_local_path: "/assets/US20120281344A1/pdf/patent.pdf",
        tags: ["Display", "Media Player", "Electronics"]
    },
    {
        id: "p3",
        page_url: "https://patents.google.com/patent/US20240181637A1/en",
        title: "Autonomous humanoid robot",
        pdf_url: "https://patentimages.storage.googleapis.com/2f/1b/c0/27850a4762165f/US20240181637A1.pdf",
        abstract: "An autonomous humanoid robot configured to overcome limited maneuvering issues by offering a more efficient autonomous humanoid robot that autonomously operates to interact with users and interact with other robots, and includes a computing system configured to provide instruction and programming for estimating and controlling pivotal movement of body components involving arms, legs and a waist module which are configured to support the body and reposition the body such that the autonomous humanoid robot can step, walk, roll or skate or perform various handling maneuvers to complete tasks.",
        images: Array.from({ length: 53 }, (_, i) => ({
            url: "",
            local_path: `/assets/US20240181637A1/pdf_images/page_${i + 1}.png`
        })),
        pdf_local_path: "/assets/US20240181637A1/pdf/patent.pdf",
        tags: ["Robotics", "AI", "Automation"]
    },
    {
        id: "p4",
        page_url: "https://patents.google.com/patent/US9911369B2/en",
        title: "Rollable display device",
        pdf_url: "https://patentimages.storage.googleapis.com/22/fa/59/34b29d4d249f59/US9911369.pdf",
        abstract: "A rollable display device is provided. The rollable display device includes: a flexible screen display which is rolled or unrolled on both sides; at least one pair of rollable driving units where each side of the flexible screen display is rolled into or unrolled from one of the pair of rollable driving units; a link driving unit for supporting the rollable driving units to move the sides of the flexible screen display and to roll or unroll the flexible screen display; and a controller for controlling operations of the rollable driving units and the link driving unit.",
        images: Array.from({ length: 18 }, (_, i) => ({
            url: "",
            local_path: `/assets/US9911369B2/pdf_images/page_${i + 1}.png`
        })),
        pdf_local_path: "/assets/US9911369B2/pdf/patent.pdf",
        tags: ["Display", "Flexible Electronics", "Screen Technology"]
    },
    {
        id: "p5",
        page_url: "https://patents.google.com/patent/US11740699B2",
        title: "Tactile feedback glove",
        pdf_url: "https://patentimages.storage.googleapis.com/7c/1f/ec/2183c057a08981/US11740699.pdf",
        abstract: "A tactile feedback glove for use in an extravehicular activity (EVA) environment by an astronaut is described. The tactile feedback glove is formed by a glove having an outer layer, a second layer and inner bladder, wherein the inner bladder encloses a gas environment suitable for an astronaut's hand. A force sensor is attached to a fingertip of each finger of the glove on an inner surface of the outer layer to sense the pressure applied at the associated fingertip. A haptic feedback device is attached to the fingertip of each finger of the glove on an outer surface of the inner bladder. Each haptic feedback device is adjacent to each associated force sensor and positioned to provide tactile feedback for the associated finger. A visual feedback device is also attached to an outer surface of the outer layer of the glove in a visual field of the astronaut. A controller receives a signal from each force sensor indicative of the force applied by the wearer at the associated fingertip, and sends a feedback signal to drive each haptic feedback device and the visual feedback device to provide tactile and visual feedback to the wearer when the signal from one of the force sensors meets preprogrammed levels.",
        images: Array.from({ length: 17 }, (_, i) => ({
            url: "",
            local_path: `/assets/US11740699B2/pdf_images/page_${i + 1}.png`
        })),
        pdf_local_path: "/assets/US11740699B2/pdf/patent.pdf",
        tags: ["Wearable", "Haptic", "Space Technology"]
    },
    {
        id: "p6",
        page_url: "https://patents.google.com/patent/US11485489B2",
        title: "Systems and methods for functionality and controls for a VTOL flying car",
        pdf_url: "https://patentimages.storage.googleapis.com/53/75/3c/ab8a2ab724e5c1/US11485489.pdf",
        abstract: "A vertical take-off and landing (VTOL) aircraft has a first drivable configuration in which the pilot seat is positioned between the wings and facing the direction of forward travel. The VTOL may be driven in the first configuration as a normal automobile. In the first configuration the wings are aligned with the direction of forward travel and their surfaces are vertically oriented. In the first configuration, the VTOL may also attain altitude and be maneuvered using thrust from propulsion sources. In a second configuration, the pilot seat is rotated 90 degrees from the direction of forward travel to a direction of forward flight. Forward flight is achieved using thrust to rotate the wings from the vertical orientation to a lift-providing orientation. In concert with the rotation of the wings, the pi lot seat is counter-rotated to maintain the seat facing the direction of forward flight.",
        images: Array.from({ length: 52 }, (_, i) => ({
            url: "",
            local_path: `/assets/US11485489B2/pdf_images/page_${i + 1}.png`
        })),
        pdf_local_path: "/assets/US11485489B2/pdf/patent.pdf",
        tags: ["VTOL", "Aviation", "Flying Car"]
    },
    {
        id: "p7",
        page_url: "https://patents.google.com/patent/US11571938B2/",
        title: "Jet-propelled VTOL hybrid car",
        pdf_url: "https://patentimages.storage.googleapis.com/15/97/2b/cae81df2c46f04/US11571938.pdf",
        abstract: "A hybrid VTOL jet car comprising a light weight floatable chassis adapted for carrying a payload, a retractable tail section attached to a light weight floatable chassis at the rear end adapted for stabilizing the hybrid VTOL jet car, a plurality of wheels at the bottom of the hybrid VTOL jet car, a plurality of retractable wings on the sides of light weight floatable chassis, adapted for maneuvering the hybrid VTOL jet car. Further features may include a plurality of thrust-producing engines adapted for generating the thrust required for driving the hybrid VTOL jet car on a surface as well as in the air and a plurality of parachutes attached to the hybrid VTOL jet car to safely land the hybrid VTOL jet car under emergency.",
        images: Array.from({ length: 32 }, (_, i) => ({
            url: "",
            local_path: `/assets/US11571938B2/pdf_images/page_${i + 1}.png`
        })),
        pdf_local_path: "/assets/US11571938B2/pdf/patent.pdf",
        tags: ["VTOL", "Aviation", "Hybrid", "Jet Propulsion"]
    },
];
