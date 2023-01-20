(()=>{
    const ueid = '5300f45e-7a70-47e6-9bc1-9cbd5178665c-' + ~~(Math.random() * 1e6);
    const target = undefined;
    const root = ((uuid,target)=>{
        const makeElement = (type,classes,attributes,content)=>{
            const element = document.createElement(type);
            if (classes)
              classes.forEach(c=>element.classList.add(c));
            if (attributes)
              Object.entries(attributes).forEach(([key,value])=>element.setAttribute(key, value));
            if (content)
              element.innerHTML = content;
            return element;
          }
        ;
        if (!target) {
          document.write(`<div id="IMT_WEB_EMBED_${uuid}"></div>`);
          target = `IMT_WEB_EMBED_${uuid}`;
        }
        const root = document.getElementById(target);
        if (!root)
          return;
        root.innerHTML = '';
        if (!document.querySelector('link[data-vendor="integromat-embed"]')) {
          const style = makeElement('link', [], {
            rel: 'stylesheet',
            type: 'text/css',
            href: `https://cdn.make.com/css/make/clicksend-embedded-widget.css`,
            'data-vendor': 'integromat-embed'
          });
          document.head.appendChild(style);
        }
        return root;
      }
    )(ueid, target);
    if (root) {
      ((uuid,root,html,drawMode,overrides)=>{
          root.innerHTML = html;
          const wrapper = root.getElementsByClassName('integromat-embed-wrapper')[0];
          if (wrapper) {
            new ResizeObserver(([entry])=>{
                const currentWidth = entry.contentRect.width;
                const element = entry.target;
                const breakpoint = 834;
                const breakpointClass = `integromat-embed-${overrides.narrowClass || drawMode}-narrow`;
                if (currentWidth <= breakpoint && !(element.classList.contains(breakpointClass))) {
                  element.classList.add(breakpointClass);
                } else if (currentWidth > breakpoint && element.classList.contains(breakpointClass)) {
                  element.classList.remove(breakpointClass);
                }
              }
            ).observe(wrapper);
            const showMoreButton = wrapper.getElementsByClassName('integromat-embed-show-more')[0];
            if (showMoreButton) {
              showMoreButton.addEventListener('click', ()=>{
                  const templates = wrapper.getElementsByClassName('integromat-embed-showmore-wrapper');
                  [...templates].forEach(template=>{
                      template.style.display = '';
                    }
                  );
                  showMoreButton.classList.add('integromat-embed-hidden');
                }
              );
            }
            const utmLinks = wrapper.getElementsByClassName('integromat-embed-utm-link');
            if (utmLinks.length) {
              [...utmLinks].forEach(utmLink=>{
                  const url = new URL(utmLink.getAttribute('href'));
                  if (!url)
                    return;
                  if (overrides.brand) {
                    url.searchParams.append(`utm_campaign`, 'clicksend-partner-program');
                    url.searchParams.append(`utm_medium`, overrides.utmMedium || 'referral');
                    url.searchParams.append(`utm_source`, window.location.hostname);
                  }
                  url.searchParams.append(`source`, 'embed-builder');
                  utmLink.setAttribute('href', url.toString());
                }
              );
            }
          }
        }
      )(ueid, root, `<div style="display: none" class="integromat-embed-wrapper integromat-embed-list integromat-embed-light"> 


        <div class="integromat-embed-showmore-wrapper" style="">
        <div>
            <div style="background: #0087ff"> <img
                    src="https://eu1.make.com/static/img/packages/acuity-scheduling_256.png"
                    alt="Icon of app Acuity"> </div>
            <div style="background: #00a5ff"> <img
                    src="https://eu1.make.com/static/img/packages/clicksend_256.png"
                    alt="Icon of app ClickSend SMS"> </div>
        </div>
        <div>
            <div>Send ClickSend SMS messages for canceled Acuity Scheduling appointments</div>
            <div>Acuity + ClickSend SMS</div>
        </div>
        <div>
            <div> <a class="integromat-embed-utm-link"
                    href="https://www.make.com/en/templates/2725-send-clicksend-sms-messages-for-canceled-acuity-scheduling-appointments"
                    target="_blank" rel="noopener noreferrer">Use</a> </div>
        </div>
        </div>
        <div class="integromat-embed-showmore-wrapper" style="">
            <div>
                <div style="background: #009bde"> <img
                        src="https://eu1.make.com/static/img/packages/scheduleonce_256.png"
                        alt="Icon of app ScheduleOnce"> </div>
                <div style="background: #00a5ff"> <img
                        src="https://eu1.make.com/static/img/packages/clicksend_256.png"
                        alt="Icon of app ClickSend SMS"> </div>
                <div style="background: #a1d36e"> <img
                            src="https://eu1.make.com/static/img/packages/builtin_256.png"
                            alt="Icon of Flow Control"> </div>
            </div>
            <div>
                <div>Send ClickSend SMS messages and create new contact when scheduling an appointment on ScheduleOnce</div>
                <div>ScheduleOnce + ClickSend SMS + Flow Control</div>
            </div>
            <div>
                <div> <a class="integromat-embed-utm-link"
                        href="https://www.make.com/en/templates/3342-send-clicksend-sms-messages-and-create-new-contact-when-scheduling-an-appointment-on-scheduleonce"
                        target="_blank" rel="noopener noreferrer">Use</a> </div>
            </div>
            </div>`, 'list', {
        narrowClass: undefined,
        utmMedium: 'partner',
        brand: true
      });
    }
  }
)();
