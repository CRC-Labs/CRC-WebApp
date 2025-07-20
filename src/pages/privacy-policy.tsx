import React from "react"

import Link from "next/link"

import Footer from "@/features/common/components/Footer"
import { LogoWithSlogan } from "@/features/common/utils/logos"

export default function Privacy() {
  return (
    <section className="flex h-full min-h-screen flex-col items-center bg-stone-300 pt-8 dark:bg-stone-900">
      <header className="mx-auto mb-8 flex max-h-[100px] max-w-[300px] items-center justify-center">
        <Link href="/">
          <LogoWithSlogan />
        </Link>
      </header>
      <main className="flex w-full flex-col items-center">
        <section className="flex flex-col items-center bg-stone-300 px-6 pb-8 dark:bg-stone-900 sm:max-w-[85vw] sm:px-20">
          <div className="w-[85vw] px-6 text-justify text-base text-gray-500 dark:text-gray-400">
            <p>
              <strong>PRIVACY NOTICE</strong>
            </p>
            <p>
              <strong>Last updated February 17, 2023</strong>
            </p>
            <p>
              This privacy notice for Chess Repertoire Companion ("
              <strong>Company</strong>," "<strong>we</strong>," "
              <strong>us</strong>," or " <strong>our</strong>" ), describes how
              and why we might collect, store, use, and/or share ("{" "}
              <strong>process</strong>" ) your information when you use our
              services ( "<strong>Services</strong>" ), such as when you:
            </p>
            <ul>
              <li>
                Visit our website at{" "}
                <a
                  href="https://chess-repertoire-companion.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://chess-repertoire-companion.com
                </a>{" "}
                , or any website of ours that links to this privacy notice
              </li>
            </ul>
            <ul>
              <li>
                Engage with us in other related ways, including any sales,
                marketing, or events
              </li>
            </ul>
            <p>
              <strong>Questions or concerns?&nbsp;</strong>Reading this privacy
              notice will help you understand your privacy rights and choices.
              If you do not agree with our policies and practices, please do not
              use our Services. If you still have any questions or concerns,
              please contact us at Jeremy@chess-repertoire-companion.com .
            </p>
            <p>
              <strong>SUMMARY OF KEY POINTS</strong>
            </p>
            <p>
              <strong>
                This summary provides key points from our privacy notice, but
                you can find out more details about any of these topics by
                clicking the link following each key point or by using our table
                of contents below to find the section you are looking for. You
                can also click&nbsp;
              </strong>{" "}
              <a href="#toc">
                <strong>here</strong>
              </a>{" "}
              <strong>&nbsp;to go directly to our table of contents.</strong>
            </p>
            <p>
              <strong>What personal information do we process?</strong> When you
              visit, use, or navigate our Services, we may process personal
              information depending on how you interact with Chess Repertoire
              Companion and the Services, the choices you make, and the products
              and features you use. Click&nbsp; <a href="#personalinfo">here</a>{" "}
              &nbsp;to learn more.
            </p>
            <p>
              <strong>Do we process any sensitive personal information?</strong>{" "}
              We do not process sensitive personal information.
            </p>
            <p>
              <strong>Do we receive any information from third parties?</strong>{" "}
              We do not receive any information from third parties.
            </p>
            <p>
              <strong>How do we process your information?</strong> We process
              your information to provide, improve, and administer our Services,
              communicate with you, for security and fraud prevention, and to
              comply with law. We may also process your information for other
              purposes with your consent. We process your information only when
              we have a valid legal reason to do so. Click&nbsp;{" "}
              <a href="#infouse">here</a> &nbsp;to learn more.
            </p>
            <p>
              <strong>
                In what situations and with which parties do we share personal
                information?
              </strong>{" "}
              We may share information in specific situations and with specific
              third parties. Click&nbsp; <a href="#whoshare">here</a> &nbsp;to
              learn more.
            </p>
            <p>
              <strong>How do we keep your information safe?</strong> We have
              organizational and technical processes and procedures in place to
              protect your personal information. However, no electronic
              transmission over the internet or information storage technology
              can be guaranteed to be 100% secure, so we cannot promise or
              guarantee that hackers, cybercriminals, or other unauthorized
              third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information.
              Click&nbsp; <a href="#infosafe">here</a> &nbsp;to learn more.
            </p>
            <p>
              <strong>What are your rights?</strong> Depending on where you are
              located geographically, the applicable privacy law may mean you
              have certain rights regarding your personal information.
              Click&nbsp; <a href="#privacyrights">here</a> &nbsp;to learn more.
            </p>
            <p>
              <strong>How do you exercise your rights?</strong> The easiest way
              to exercise your rights is to contact us. We will consider and act
              upon any request in accordance with applicable data protection
              laws.
            </p>
            <p>
              Want to learn more about what Chess Repertoire Companion does with
              any information we collect? Click&nbsp; <a href="#toc">here</a>{" "}
              &nbsp;to review the notice in full.
            </p>
            <p>
              <strong>TABLE OF CONTENTS</strong>
            </p>
            <p>
              <a href="#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a>
            </p>
            <p>
              <a href="#infouse">2. HOW DO WE PROCESS YOUR INFORMATION?</a>
            </p>
            <p>
              <a href="#legalbases">
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL
                INFORMATION?
              </a>
            </p>
            <p>
              <a href="#whoshare">
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </a>
            </p>
            <p>
              <a href="#inforetain">5. HOW LONG DO WE KEEP YOUR INFORMATION?</a>
            </p>
            <p>
              <a href="#infosafe">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</a>
            </p>
            <p>
              <a href="#privacyrights">7. WHAT ARE YOUR PRIVACY RIGHTS?</a>
            </p>
            <p>
              <a href="#DNT">8. CONTROLS FOR DO-NOT-TRACK FEATURES</a>
            </p>
            <p>
              <a href="#caresidents">
                9. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </a>
            </p>
            <p>
              <a href="#virginia">
                10. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </a>
            </p>
            <p>
              <a href="#policyupdates">
                11. DO WE MAKE UPDATES TO THIS NOTICE?
              </a>
            </p>
            <p>
              <a href="#contact">
                12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </a>
            </p>
            <p>
              <a href="#request">
                13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </a>
            </p>
            <p>
              <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
            </p>
            <p>
              <strong>Personal information you disclose to us</strong>
            </p>
            <p>
              <strong>In Short:</strong> <strong>&nbsp;</strong> We collect
              personal information that you provide to us.
            </p>
            <p>
              We collect personal information that you voluntarily provide to us
              when you register on the Services,&nbsp; express an interest in
              obtaining information about us or our products and Services, when
              you participate in activities on the Services, or otherwise when
              you contact us.
            </p>
            <p>
              <strong>Personal Information Provided by You.</strong> The
              personal information that we collect depends on the context of
              your interactions with us and the Services, the choices you make,
              and the products and features you use. The personal information we
              collect may include the following:
            </p>
            <ul>
              <li>email addresses</li>
            </ul>
            <p>
              <strong>Sensitive Information.</strong> We do not process
              sensitive information.
            </p>
            <p>
              All personal information that you provide to us must be true,
              complete, and accurate, and you must notify us of any changes to
              such personal information.
            </p>
            <p>
              <strong>2. HOW DO WE PROCESS YOUR INFORMATION?</strong>
            </p>
            <p>
              <strong>In Short:&nbsp;</strong> We process your information to
              provide, improve, and administer our Services, communicate with
              you, for security and fraud prevention, and to comply with law. We
              may also process your information for other purposes with your
              consent.
            </p>
            <p>
              <strong>
                We process your personal information for a variety of reasons,
                depending on how you interact with our Services, including:
              </strong>
            </p>
            <ul>
              <li>
                <strong>
                  To facilitate account creation and authentication and
                  otherwise manage user accounts.&nbsp;
                </strong>{" "}
                We may process your information so you can create and log in to
                your account, as well as keep your account in working order.
              </li>
            </ul>
            <ul>
              <li>
                <strong>
                  To deliver and facilitate delivery of services to the
                  user.&nbsp;
                </strong>{" "}
                We may process your information to provide you with the
                requested service.
              </li>
            </ul>
            <ul>
              <li>
                <strong>
                  To save or protect an individual's vital interest.
                </strong>{" "}
                We may process your information when necessary to save or
                protect an individual’s vital interest, such as to prevent harm.
              </li>
            </ul>
            <p>
              <strong>
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
              </strong>
            </p>
            <p>
              <strong>In Short:&nbsp;</strong> We only process your personal
              information when we believe it is necessary and we have a valid
              legal reason (i.e. , legal basis) to do so under applicable law,
              like with your consent, to comply with laws, to provide you with
              services to enter into or fulfill our contractual obligations, to
              protect your rights, or to fulfill our legitimate business
              interests.
            </p>
            <p>
              <strong>
                If you are located in the EU or UK, this section applies to you.
              </strong>
            </p>
            <p>
              The General Data Protection Regulation (GDPR) and UK GDPR require
              us to explain the valid legal bases we rely on in order to process
              your personal information. As such, we may rely on the following
              legal bases to process your personal information:
            </p>
            <ul>
              <li>
                <strong>Consent.&nbsp;</strong> We may process your information
                if you have given us permission (i.e. , consent) to use your
                personal information for a specific purpose. You can withdraw
                your consent at any time. Click&nbsp;{" "}
                <a href="#withdrawconsent">here</a> &nbsp;to learn more.
              </li>
            </ul>
            <ul>
              <li>
                <strong>Performance of a Contract.</strong> We may process your
                personal information when we believe it is necessary to fulfill
                our contractual obligations to you, including providing our
                Services or at your request prior to entering into a contract
                with you.
              </li>
            </ul>
            <ul>
              <li>
                <strong>Legal Obligations.</strong> We may process your
                information where we believe it is necessary for compliance with
                our legal obligations, such as to cooperate with a law
                enforcement body or regulatory agency, exercise or defend our
                legal rights, or disclose your information as evidence in
                litigation in which we are involved.
              </li>
            </ul>
            <ul>
              <li>
                <strong>Vital Interests.</strong> We may process your
                information where we believe it is necessary to protect your
                vital interests or the vital interests of a third party, such as
                situations involving potential threats to the safety of any
                person.
              </li>
            </ul>
            <p>
              <strong>
                If you are located in Canada, this section applies to you.
              </strong>
            </p>
            <p>
              We may process your information if you have given us specific
              permission (i.e. , express consent) to use your personal
              information for a specific purpose, or in situations where your
              permission can be inferred (i.e. , implied consent). You can
              withdraw your consent at any time. Click&nbsp;{" "}
              <a href="#withdrawconsent">here</a> &nbsp;to learn more.
            </p>
            <p>
              In some exceptional cases, we may be legally permitted under
              applicable law to process your information without your consent,
              including, for example:
            </p>
            <ul>
              <li>
                If collection is clearly in the interests of an individual and
                consent cannot be obtained in a timely way
              </li>
            </ul>
            <ul>
              <li>For investigations and fraud detection and prevention</li>
            </ul>
            <ul>
              <li>
                For business transactions provided certain conditions are met
              </li>
            </ul>
            <ul>
              <li>
                If it is contained in a witness statement and the collection is
                necessary to assess, process, or settle an insurance claim
              </li>
            </ul>
            <ul>
              <li>
                For identifying injured, ill, or deceased persons and
                communicating with next of kin
              </li>
            </ul>
            <ul>
              <li>
                If we have reasonable grounds to believe an individual has been,
                is, or may be victim of financial abuse
              </li>
            </ul>
            <ul>
              <li>
                If it is reasonable to expect collection and use with consent
                would compromise the availability or the accuracy of the
                information and the collection is reasonable for purposes
                related to investigating a breach of an agreement or a
                contravention of the laws of Canada or a province
              </li>
            </ul>
            <ul>
              <li>
                If disclosure is required to comply with a subpoena, warrant,
                court order, or rules of the court relating to the production of
                records
              </li>
            </ul>
            <ul>
              <li>
                If it was produced by an individual in the course of their
                employment, business, or profession and the collection is
                consistent with the purposes for which the information was
                produced
              </li>
            </ul>
            <ul>
              <li>
                If the collection is solely for journalistic, artistic, or
                literary purposes
              </li>
            </ul>
            <ul>
              <li>
                If the information is publicly available and is specified by the
                regulations
              </li>
            </ul>
            <p>
              <strong>
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </strong>
            </p>
            <p>
              <strong>In Short:</strong> &nbsp;We may share information in
              specific situations described in this section and/or with the
              following third parties.
            </p>
            <p>
              We may need to share your personal information in the following
              situations:
            </p>
            <ul>
              <li>
                <strong>Business Transfers.</strong> We may share or transfer
                your information in connection with, or during negotiations of,
                any merger, sale of company assets, financing, or acquisition of
                all or a portion of our business to another company.
              </li>
            </ul>
            <p>
              <strong>5. HOW LONG DO WE KEEP YOUR INFORMATION?</strong>
            </p>
            <p>
              <strong>In Short:&nbsp;</strong> We keep your information for as
              long as necessary to fulfill the purposes outlined in this privacy
              notice unless otherwise required by law.
            </p>
            <p>
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy notice, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting, or other legal requirements). No purpose in this
              notice will require us keeping your personal information for
              longer than the period of time in which users have an account with
              us .
            </p>
            <p>
              When we have no ongoing legitimate business need to process your
              personal information, we will either delete or anonymize such
              information, or, if this is not possible (for example, because
              your personal information has been stored in backup archives),
              then we will securely store your personal information and isolate
              it from any further processing until deletion is possible.
            </p>
            <p>
              <strong>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</strong>
            </p>
            <p>
              <strong>In Short:&nbsp;</strong> We aim to protect your personal
              information through a system of organizational and technical
              security measures.
            </p>
            <p>
              We have implemented appropriate and reasonable technical and{" "}
              organizational security measures designed to protect the security
              of any personal information we process. However, despite our
              safeguards and efforts to secure your information, no electronic
              transmission over the Internet or information storage technology
              can be guaranteed to be 100% secure, so we cannot promise or
              guarantee that hackers, cybercriminals, or other unauthorized{" "}
              third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information.
              Although we will do our best to protect your personal information,
              transmission of personal information to and from our Services is
              at your own risk. You should only access the Services within a
              secure environment.
            </p>
            <p>
              <strong>7. WHAT ARE YOUR PRIVACY RIGHTS?</strong>
            </p>
            <p>
              <strong>In Short:</strong> &nbsp; In some regions, such as the
              European Economic Area (EEA), United Kingdom (UK), and Canada ,
              you have rights that allow you greater access to and control over
              your personal information. &nbsp; You may review, change, or
              terminate your account at any time.
            </p>
            <p>
              In some regions (like the EEA, UK, and Canada ), you have certain
              rights under applicable data protection laws. These may include
              the right (i) to request access and obtain a copy of your personal
              information, (ii) to request rectification or erasure; (iii) to
              restrict the processing of your personal information; and (iv) if
              applicable, to data portability. In certain circumstances, you may
              also have the right to object to the processing of your personal
              information. You can make such a request by contacting us by using
              the contact details provided in the section "{" "}
              <a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a> "{" "}
              below.
            </p>
            <p>
              We will consider and act upon any request in accordance with
              applicable data protection laws.
            </p>
            <p>&nbsp;</p>
            <p>
              If you are located in the EEA or UK and you believe we are
              unlawfully processing your personal information, you also have the
              right to complain to your local data protection supervisory
              authority. You can find their contact details here:{" "}
              <a
                href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
              </a>{" "}
              .
            </p>
            <p>
              If you are located in Switzerland, the contact details for the
              data protection authorities are available here:{" "}
              <a
                href="https://www.edoeb.admin.ch/edoeb/en/home.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.edoeb.admin.ch/edoeb/en/home.html
              </a>{" "}
              .
            </p>
            <p>
              <strong>Withdrawing your consent:</strong> If we are relying on
              your consent to process your personal information, which may be
              express and/or implied consent depending on the applicable law,{" "}
              you have the right to withdraw your consent at any time. You can
              withdraw your consent at any time by contacting us by using the
              contact details provided in the section "{" "}
              <a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a> "{" "}
              below .
            </p>
            <p>
              However, please note that this will not affect the lawfulness of
              the processing before its withdrawal nor, when applicable law
              allows, will it affect the processing of your personal information
              conducted in reliance on lawful processing grounds other than
              consent.
            </p>
            <p>
              <strong>Account Information</strong>
            </p>
            <p>
              If you would at any time like to review or change the information
              in your account or terminate your account, you can:
            </p>
            <ul>
              <li>Contact us using the contact information provided.</li>
            </ul>
            <p>
              Upon your request to terminate your account, we will deactivate or
              delete your account and information from our active databases.
              However, we may retain some information in our files to prevent
              fraud, troubleshoot problems, assist with any investigations,
              enforce our legal terms and/or comply with applicable legal
              requirements.
            </p>
            <p>
              If you have questions or comments about your privacy rights, you
              may email us at jeremy@chess-repertoire-companion.com .
            </p>
            <p>
              <strong>8. CONTROLS FOR DO-NOT-TRACK FEATURES</strong>
            </p>
            <p>
              Most web browsers and some mobile operating systems and mobile
              applications include a Do-Not-Track ( "DNT" ) feature or setting
              you can activate to signal your privacy preference not to have
              data about your online browsing activities monitored and
              collected. At this stage no uniform technology standard for{" "}
              recognizing and implementing DNT signals has been finalized . As
              such, we do not currently respond to DNT browser signals or any
              other mechanism that automatically communicates your choice not to
              be tracked online. If a standard for online tracking is adopted
              that we must follow in the future, we will inform you about that
              practice in a revised version of this privacy notice.
            </p>
            <p>
              <strong>
                9. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </strong>
            </p>
            <p>
              <strong>In Short:&nbsp;</strong> Yes, if you are a resident of
              California, you are granted specific rights regarding access to
              your personal information.
            </p>
            <p>
              California Civil Code Section 1798.83, also known as the "Shine
              The Light" law, permits our users who are California residents to
              request and obtain from us, once a year and free of charge,
              information about categories of personal information (if any) we
              disclosed to third parties for direct marketing purposes and the
              names and addresses of all third parties with which we shared
              personal information in the immediately preceding calendar year.
              If you are a California resident and would like to make such a
              request, please submit your request in writing to us using the
              contact information provided below.
            </p>
            <p>
              If you are under 18 years of age, reside in California, and have a
              registered account with Services, you have the right to request
              removal of unwanted data that you publicly post on the Services.
              To request removal of such data, please contact us using the
              contact information provided below and include the email address
              associated with your account and a statement that you reside in
              California. We will make sure the data is not publicly displayed
              on the Services, but please be aware that the data may not be
              completely or comprehensively removed from all our systems (e.g. ,{" "}
              backups, etc.).
            </p>
            <p>
              <strong>CCPA Privacy Notice</strong>
            </p>
            <p>The California Code of Regulations defines a "resident" as:</p>
            <p>
              (1) every individual who is in the State of California for other
              than a temporary or transitory purpose and
            </p>
            <p>
              (2) every individual who is domiciled in the State of California
              who is outside the State of California for a temporary or
              transitory purpose
            </p>
            <p>All other individuals are defined as "non-residents."</p>
            <p>
              If this definition of "resident" applies to you, we must adhere to
              certain rights and obligations regarding your personal
              information.
            </p>
            <p>
              <strong>
                What categories of personal information do we collect?
              </strong>
            </p>
            <p>
              We have collected the following categories of personal information
              in the past twelve (12) months: email address
            </p>

            <p>
              We will use and retain the collected personal information as
              needed to provide the Services or for:
            </p>
            <ul>
              <li>Category A - As long as the user has an account with us</li>
            </ul>
            <p>
              We may also collect other personal information outside of these
              categories through instances where you interact with us in person,
              online, or by phone or mail in the context of:
            </p>
            <ul>
              <li>Receiving help through our customer support channels;</li>
            </ul>
            <ul>
              <li>Participation in customer surveys or contests; and</li>
            </ul>
            <ul>
              <li>
                Facilitation in the delivery of our Services and to respond to
                your inquiries.
              </li>
            </ul>
            <p>
              <strong>
                How do we use and share your personal information?
              </strong>
            </p>
            <p>
              More information about our data collection and sharing practices
              can be found in this privacy notice .
            </p>
            <p>
              You may contact us by email at&nbsp;
              jeremy@chess-repertoire-companion.com , or by referring to the
              contact details at the bottom of this document.
            </p>
            <p>
              If you are using an authorized agent to exercise your right to opt
              out we may deny a request if the authorized agent does not submit
              proof that they have been validly authorized to act on your
              behalf.
            </p>
            <p>
              <strong>Will your information be shared with anyone else?</strong>
            </p>
            <p>
              We may disclose your personal information with our service
              providers pursuant to a written contract between us and each
              service provider. Each service provider is a for-profit entity
              that processes the information on our behalf, following the same
              strict privacy protection obligations mandated by the CCPA.
            </p>
            <p>
              We may use your personal information for our own business
              purposes, such as for undertaking internal research for
              technological development and demonstration. This is not
              considered to be "selling" of your personal information.
            </p>
            <p>
              Chess Repertoire Companion &nbsp;has not disclosed, sold, or
              shared any personal information to third parties for a business or
              commercial purpose in the preceding twelve (12) months. Chess
              Repertoire Companion &nbsp; will not sell or share personal
              information in the future belonging to website visitors, users,
              and other consumers.
            </p>
            <p>
              <strong>Your rights with respect to your personal data</strong>
            </p>
            <p>Right to request deletion of the data — Request to delete</p>
            <p>
              You can ask for the deletion of your personal information. If you
              ask us to delete your personal information, we will respect your
              request and delete your personal information, subject to certain
              exceptions provided by law, such as (but not limited to) the
              exercise by another consumer of his or her right to free speech,
              our compliance requirements resulting from a legal obligation, or
              any processing that may be required to protect against illegal
              activities.
            </p>
            <p>Right to be informed — Request to know</p>
            <p>Depending on the circumstances, you have a right to know:</p>
            <ul>
              <li>whether we collect and use your personal information;</li>
            </ul>
            <ul>
              <li>the categories of personal information that we collect;</li>
            </ul>
            <ul>
              <li>
                the purposes for which the collected personal information is
                used;
              </li>
            </ul>
            <ul>
              <li>
                whether we sell or share personal information to third parties;
              </li>
            </ul>
            <ul>
              <li>
                the categories of personal information that we sold, shared, or
                disclosed for a business purpose;
              </li>
            </ul>
            <ul>
              <li>
                the categories of third parties to whom the personal information
                was sold, shared, or disclosed for a business purpose;
              </li>
            </ul>
            <ul>
              <li>
                the business or commercial purpose for collecting, selling, or
                sharing personal information; and
              </li>
            </ul>
            <ul>
              <li>
                the specific pieces of personal information we collected about
                you.
              </li>
            </ul>
            <p>
              In accordance with applicable law, we are not obligated to provide
              or delete consumer information that is de-identified in response
              to a consumer request or to re-identify individual data to verify
              a consumer request.
            </p>
            <p>
              Right to Non-Discrimination for the Exercise of a Consumer’s
              Privacy Rights
            </p>
            <p>
              We will not discriminate against you if you exercise your privacy
              rights.
            </p>
            <p>
              Right to Limit Use and Disclosure of Sensitive Personal
              Information
            </p>
            <p>We do not process consumer's sensitive personal information.</p>
            <p>Verification process</p>
            <p>
              Upon receiving your request, we will need to verify your identity
              to determine you are the same person about whom we have the
              information in our system. These verification efforts require us
              to ask you to provide information so that we can match it with
              information you have previously provided us. For instance,
              depending on the type of request you submit, we may ask you to
              provide certain information so that we can match the information
              you provide with the information we already have on file, or we
              may contact you through a communication method (e.g. , phone or
              email) that you have previously provided to us. We may also use
              other verification methods as the circumstances dictate.
            </p>
            <p>
              We will only use personal information provided in your request to
              verify your identity or authority to make the request. To the
              extent possible, we will avoid requesting additional information
              from you for the purposes of verification. However, if we cannot
              verify your identity from the information already maintained by
              us, we may request that you provide additional information for the
              purposes of verifying your identity and for security or
              fraud-prevention purposes. We will delete such additionally
              provided information as soon as we finish verifying you.
            </p>
            <p>Other privacy rights</p>
            <ul>
              <li>
                You may object to the processing of your personal information.
              </li>
            </ul>
            <ul>
              <li>
                You may request correction of your personal data if it is
                incorrect or no longer relevant, or ask to restrict the
                processing of the information.
              </li>
            </ul>
            <ul>
              <li>
                You can designate an authorized agent to make a request under
                the CCPA on your behalf. We may deny a request from an{" "}
                authorized agent that does not submit proof that they have been
                validly authorized to act on your behalf in accordance with the
                CCPA.
              </li>
            </ul>
            <ul>
              <li>
                You may request to opt out from future selling or sharing of
                your personal information to third parties. Upon receiving an
                opt-out request, we will act upon the request as soon as
                feasibly possible, but no later than fifteen (15) days from the
                date of the request submission.
              </li>
            </ul>
            <p>
              To exercise these rights, you can contact us&nbsp; by email at{" "}
              jeremy@chess-repertoire-companion.com , or by referring to the
              contact details at the bottom of this document. If you have a
              complaint about how we handle your data, we would like to hear
              from you.
            </p>
            <p>
              <strong>
                10. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </strong>
            </p>
            <p>
              <strong>In Short:</strong> &nbsp;Yes, if you are a resident of
              Virginia, you may be granted specific rights regarding access to
              and use of your personal information.
            </p>
            <p>
              <strong>Virginia CDPA Privacy Notice</strong>
            </p>
            <p>Under the Virginia Consumer Data Protection Act (CDPA):</p>
            <p>
              "Consumer" means a natural person who is a resident of the
              Commonwealth acting only in an individual or household context. It
              does not include a natural person acting in a commercial or
              employment context.
            </p>
            <p>
              "Personal data" means any information that is linked or reasonably
              linkable to an identified or identifiable natural person.{" "}
              "Personal data" does not include de-identified data or publicly
              available information.
            </p>
            <p>
              "Sale of personal data" means the exchange of personal data for
              monetary consideration.
            </p>
            <p>
              If this definition "consumer" applies to you, we must adhere to
              certain rights and obligations regarding your personal data.
            </p>
            <p>
              The information we collect, use, and disclose about you will vary
              depending on how you interact with Chess Repertoire Companion and
              our Services. To find out more, please visit the following links:
            </p>
            <ul>
              <li>
                <a href="#infocollect">Personal data we collect</a>
              </li>
            </ul>
            <ul>
              <li>
                <a href="#infouse">How we use your personal data</a>
              </li>
            </ul>
            <ul>
              <li>
                <a href="#whoshare">
                  When and with whom we share your personal data
                </a>
              </li>
            </ul>
            <p>Your rights with respect to your personal data</p>
            <ul>
              <li>
                Right to be informed whether or not we are processing your
                personal data
              </li>
            </ul>
            <ul>
              <li>Right to access your personal data</li>
            </ul>
            <ul>
              <li>Right to correct inaccuracies in your personal data</li>
            </ul>
            <ul>
              <li>Right to request deletion of your personal data</li>
            </ul>
            <ul>
              <li>
                Right to obtain a copy of the personal data you previously
                shared with us
              </li>
            </ul>
            <ul>
              <li>
                Right to opt out of the processing of your personal data if it
                is used for targeted advertising, the sale of personal data, or
                profiling in furtherance of decisions that produce legal or
                similarly significant effects ( "profiling" )
              </li>
            </ul>
            <p>
              Chess Repertoire Companion has not sold any personal data to third
              parties for business or commercial purposes. Chess Repertoire
              Companion will not sell personal data in the future belonging to
              website visitors, users, and other consumers.
            </p>
            <p>Exercise your rights provided under the Virginia CDPA</p>
            <p>
              More information about our data collection and sharing practices
              can be found in this privacy notice .
            </p>
            <p>
              You may contact us by email at{" "}
              jeremy@chess-repertoire-companion.com , by visiting our Discord.
            </p>
            <p>
              If you are using an authorized agent to exercise your rights, we
              may deny a request if the authorized agent does not submit proof
              that they have been validly authorized to act on your behalf.
            </p>
            <p>Verification process</p>
            <p>
              We may request that you provide additional information reasonably
              necessary to verify you and your consumer's request. If you submit
              the request through an authorized agent, we may need to collect
              additional information to verify your identity before processing
              your request.
            </p>
            <p>
              Upon receiving your request, we will respond without undue delay,
              but in all cases, within forty-five (45) days of receipt. The
              response period may be extended once by forty-five (45) additional
              days when reasonably necessary. We will inform you of any such
              extension within the initial 45-day response period, together with
              the reason for the extension.
            </p>
            <p>Right to appeal</p>
            <p>
              If we decline to take action regarding your request, we will
              inform you of our decision and reasoning behind it.&nbsp; If you
              wish to appeal our decision, please email us at{" "}
              jeremy@chess-repertoire-companion.com . Within sixty (60) days of
              receipt of an appeal, we will inform you in writing of any action
              taken or not taken in response to the appeal, including a written
              explanation of the reasons for the decisions. If your appeal if
              denied, you may contact the Attorney General to&nbsp;{" "}
              <a
                href="https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint"
                target="_blank"
                rel="noopener noreferrer"
              >
                submit a complaint
              </a>{" "}
              .
            </p>
            <p>
              <strong>11. DO WE MAKE UPDATES TO THIS NOTICE?</strong>
            </p>
            <p>
              <strong>In Short:&nbsp;</strong> Yes, we will update this notice
              as necessary to stay compliant with relevant laws.
            </p>
            <p>
              We may update this privacy notice from time to time. The updated
              version will be indicated by an updated "Revised" date and the
              updated version will be effective as soon as it is accessible. If
              we make material changes to this privacy notice, we may notify you
              either by prominently posting a notice of such changes or by
              directly sending you a notification. We encourage you to review
              this privacy notice frequently to be informed of how we are
              protecting your information.
            </p>
            <p>
              <strong>12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</strong>
            </p>
            <p>
              If you have questions or comments about this notice, you may email
              us at jeremy@chess-repertoire-companion.com &nbsp;or by post to:
            </p>
            <p>Chess Repertoire Companion</p>
            <p>272 route des écuries</p>
            <p>BIRON 24540</p>
            <p>France</p>
            <p>
              <strong>
                13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </strong>
            </p>
            <p>
              Based on the applicable laws of your country, you may have the
              right to request access to the personal information we collect
              from you, change that information, or delete it. To request to
              review, update, or delete your personal information, please submit
              a request on the discord or by mail at
              jeremy@chess-repertoire-companion.com .
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </section>
  )
}
